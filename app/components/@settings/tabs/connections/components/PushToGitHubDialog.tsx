import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { Input } from '~/components/ui/Input';
import { Switch } from '@radix-ui/react-switch';
import { classNames } from '~/utils/classNames';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getLocalStorage } from '~/lib/persistence';
import type { GitHubUserResponse } from '~/types/GitHub';
import { workbenchStore } from '~/lib/stores/workbench';
import { formatSize } from '~/utils/formatSize';

interface PushToGitHubDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPush: (repoName: string, username: string, token: string, isPrivate: boolean) => Promise<string | void>;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  updated_at: string;
  language: string;
  private: boolean;
}

interface FileContent {
  path: string;
  content: string | undefined;
}

export function PushToGitHubDialog({ isOpen, onClose, onPush }: PushToGitHubDialogProps) {
  const [repoName, setRepoName] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GitHubUserResponse | null>(null);
  const [recentRepos, setRecentRepos] = useState<GitHubRepo[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdRepoUrl, setCreatedRepoUrl] = useState('');
  const [pushedFiles, setPushedFiles] = useState<{ path: string; size: number }[]>([]);
  const [syncOverview, setSyncOverview] = useState<{
    totalFiles: number;
    totalSize: number;
    files: { path: string; size: number }[];
  }>({ totalFiles: 0, totalSize: 0, files: [] });
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [pendingPush, setPendingPush] = useState<{
    repoName: string;
    username: string;
    token: string;
    isPrivate: boolean;
  } | null>(null);

  const resetDialogState = () => {
    setRepoName('');
    setIsPrivate(false);
    setIsLoading(false);
    setShowSuccessDialog(false);
    setCreatedRepoUrl('');
    setPushedFiles([]);
    setShowOverwriteWarning(false);
    setPendingPush(null);
  };

  const handleClose = () => {
    resetDialogState();
    onClose();
  };

  // Load GitHub connection on mount
  useEffect(() => {
    if (isOpen) {
      const connection = getLocalStorage('github_connection');

      if (connection?.user && connection?.token) {
        setUser(connection.user);
        setUsername(connection.user.login);
        setToken(connection.token);

        // Only fetch if we have both user and token
        if (connection.token.trim()) {
          fetchRecentRepos(connection.token);
        }
      }

      // Get sync overview
      const filesMap = workbenchStore.files.get();
      const filesList = Object.entries(filesMap).map(([path, file]) => ({
        path,
        content: file && 'content' in file ? file.content : undefined,
      })) as FileContent[];

      const overview = {
        totalFiles: filesList.length,
        totalSize: filesList.reduce((sum, file) => {
          if (!file.content) {
            return sum;
          }

          return sum + new TextEncoder().encode(file.content).length;
        }, 0),
        files: filesList
          .filter((file): file is FileContent & { content: string } => !!file.content)
          .map((file) => ({
            path: file.path,
            size: new TextEncoder().encode(file.content).length,
          })),
      };

      setSyncOverview(overview);
    }
  }, [isOpen]);

  const fetchRecentRepos = async (token: string) => {
    if (!token) {
      toast.error('Please provide a GitHub token');
      return;
    }

    setIsFetchingRepos(true);

    try {
      // First validate the token by checking the user endpoint
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userResponse.ok) {
        // If token is invalid, clear it and notify user
        setToken('');
        throw new Error(`Failed to validate token: ${userResponse.statusText}`);
      }

      // Now fetch repositories
      const reposResponse = await fetch(
        'https://api.github.com/user/repos?sort=updated&per_page=5&type=all&affiliation=owner,organization_member',
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
      }

      const repos = (await reposResponse.json()) as GitHubRepo[];
      setRecentRepos(repos);
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to fetch repositories');
      }

      // Clear repos to prevent showing stale data
      setRecentRepos([]);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repoName || !username || !token) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if repository exists
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (response.status === 200) {
        // Repository exists, show warning
        setPendingPush({ repoName, username, token, isPrivate });
        setShowOverwriteWarning(true);

        return;
      } else if (response.status !== 404) {
        // Some other error occurred
        const errorData = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || 'Failed to check repository');
      }
    } catch (error) {
      console.error('Failed to check repository:', error);
      toast.error('Failed to check if repository exists');

      return;
    }

    // Repository doesn't exist, proceed with push
    await executePush(repoName, username, token, isPrivate);
  };

  const executePush = async (repoName: string, username: string, token: string, isPrivate: boolean) => {
    setIsLoading(true);

    try {
      const result = await onPush(repoName, username, token, isPrivate);

      if (result) {
        // Set the repository URL for the success dialog
        const repoUrl = result;
        setCreatedRepoUrl(repoUrl);

        // Set the pushed files for the success dialog
        setPushedFiles(syncOverview.files);

        // Show the success dialog
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Failed to push to GitHub:', error);

      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('already exists')) {
          toast.error('Repository already exists. Please choose a different name.');
        } else if (error.message.includes('Bad credentials')) {
          toast.error('Invalid GitHub token. Please check your credentials.');
        } else {
          toast.error(`Failed to push to GitHub: ${error.message}`);
        }
      } else {
        toast.error('Failed to push to GitHub. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setPendingPush(null);
    }
  };

  // Overwrite Warning Dialog
  if (showOverwriteWarning && pendingPush) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" />
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-[90vw] md:w-[500px]"
            >
              <Dialog.Content className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E5E5] dark:border-[#333333] shadow-xl">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <div className="i-ph:warning w-5 h-5" />
                    <h3 className="text-lg font-medium">Repository Already Exists</h3>
                  </div>

                  <p className="text-sm text-bolt-elements-textSecondary">
                    The repository{' '}
                    <code className="px-1 py-0.5 rounded bg-bolt-elements-background-depth-3">
                      {pendingPush.repoName}
                    </code>{' '}
                    already exists. Pushing to this repository will overwrite any existing files. Are you sure you want
                    to continue?
                  </p>

                  <div className="bg-bolt-elements-background-depth-2 dark:bg-bolt-elements-background-depth-3 rounded-lg p-3">
                    <p className="text-xs text-bolt-elements-textSecondary mb-2">
                      Files to be pushed ({syncOverview.files.length})
                    </p>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                      {syncOverview.files.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between py-1 text-sm text-bolt-elements-textPrimary"
                        >
                          <span className="font-mono truncate flex-1">{file.path}</span>
                          <span className="text-xs text-bolt-elements-textSecondary ml-2">{formatSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <motion.button
                      onClick={() => {
                        setShowOverwriteWarning(false);
                        setPendingPush(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#F5F5F5] dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-[#E5E5E5] dark:hover:bg-[#252525] text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setShowOverwriteWarning(false);
                        executePush(
                          pendingPush.repoName,
                          pendingPush.username,
                          pendingPush.token,
                          pendingPush.isPrivate,
                        );
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 text-sm inline-flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="i-ph:warning w-4 h-4" />
                      Yes, Overwrite Files
                    </motion.button>
                  </div>
                </div>
              </Dialog.Content>
            </motion.div>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  // Success Dialog
  if (showSuccessDialog) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" />
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-[90vw] md:w-[600px] max-h-[85vh] overflow-y-auto"
            >
              <Dialog.Content className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E5E5E5] dark:border-[#333333] shadow-xl">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-500">
                      <div className="i-ph:check-circle w-5 h-5" />
                      <h3 className="text-lg font-medium">Successfully pushed to GitHub</h3>
                    </div>
                    <Dialog.Close
                      onClick={handleClose}
                      className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      <div className="i-ph:x w-5 h-5" />
                    </Dialog.Close>
                  </div>

                  <div className="bg-bolt-elements-background-depth-2 dark:bg-bolt-elements-background-depth-3 rounded-lg p-3 text-left">
                    <p className="text-xs text-bolt-elements-textSecondary dark:text-bolt-elements-textSecondary-dark mb-2">
                      Repository URL
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-bolt-elements-background dark:bg-bolt-elements-background-dark px-3 py-2 rounded border border-bolt-elements-borderColor dark:border-bolt-elements-borderColor-dark text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary-dark font-mono">
                        {createdRepoUrl}
                      </code>
                      <motion.button
                        onClick={() => {
                          navigator.clipboard.writeText(createdRepoUrl);
                          toast.success('URL copied to clipboard');
                        }}
                        className="p-2 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary dark:text-bolt-elements-textSecondary-dark dark:hover:text-bolt-elements-textPrimary-dark"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div className="i-ph:copy w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="bg-bolt-elements-background-depth-2 dark:bg-bolt-elements-background-depth-3 rounded-lg p-3">
                    <p className="text-xs text-bolt-elements-textSecondary dark:text-bolt-elements-textSecondary-dark mb-2">
                      Pushed Files ({pushedFiles.length})
                    </p>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                      {pushedFiles.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between py-1 text-sm text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary-dark"
                        >
                          <span className="font-mono truncate flex-1">{file.path}</span>
                          <span className="text-xs text-bolt-elements-textSecondary dark:text-bolt-elements-textSecondary-dark ml-2">
                            {formatSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <motion.a
                      href={createdRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 text-sm inline-flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="i-ph:github-logo w-4 h-4" />
                      View Repository
                    </motion.a>
                    <motion.button
                      onClick={() => {
                        navigator.clipboard.writeText(createdRepoUrl);
                        toast.success('URL copied to clipboard');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#F5F5F5] dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-[#E5E5E5] dark:hover:bg-[#252525] text-sm inline-flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="i-ph:copy w-4 h-4" />
                      Copy URL
                    </motion.button>
                    <motion.button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-lg bg-[#F5F5F5] dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-[#E5E5E5] dark:hover:bg-[#252525] text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </Dialog.Content>
            </motion.div>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  if (!user) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" />
          <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-[90vw] md:w-[500px]"
            >
              <Dialog.Content className="bg-white dark:bg-[#0A0A0A] rounded-lg p-6 border border-[#E5E5E5] dark:border-[#1A1A1A] shadow-xl">
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto w-12 h-12 rounded-xl bg-bolt-elements-background-depth-3 flex items-center justify-center text-purple-500"
                  >
                    <div className="i-ph:github-logo w-6 h-6" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">GitHub Connection Required</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please connect your GitHub account in Settings {'>'} Connections to push your code to GitHub.
                  </p>
                  <motion.button
                    className="px-4 py-2 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600 inline-flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                  >
                    <div className="i-ph:x-circle" />
                    Close
                  </motion.button>
                </div>
              </Dialog.Content>
            </motion.div>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" />
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[90vw] md:w-[600px]"
          >
            <Dialog.Content className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-[#E5E5E5] dark:border-[#1A1A1A] shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-10 h-10 rounded-xl bg-bolt-elements-background-depth-3 flex items-center justify-center text-purple-500"
                  >
                    <div className="i-ph:git-branch w-5 h-5" />
                  </motion.div>
                  <div>
                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                      Push to GitHub
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Push your code to a new or existing GitHub repository
                    </p>
                  </div>
                  <Dialog.Close
                    className="ml-auto p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    onClick={handleClose}
                  >
                    <div className="i-ph:x w-5 h-5" />
                  </Dialog.Close>
                </div>

                {/* GitHub User Info */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-bolt-elements-background-depth-2 dark:bg-bolt-elements-background-depth-3 rounded-lg">
                  <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.login}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.login}</p>
                  </div>
                </div>

                {/* Sync Overview */}
                <div className="mb-6 p-4 bg-bolt-elements-background-depth-2 dark:bg-bolt-elements-background-depth-3 rounded-lg">
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Files to Push</h4>
                  <div className="flex items-center justify-between text-sm text-bolt-elements-textSecondary mb-3">
                    <span>{syncOverview.totalFiles} files</span>
                    <span>{formatSize(syncOverview.totalSize)}</span>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {syncOverview.files.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between py-1 text-sm text-bolt-elements-textPrimary"
                      >
                        <span className="font-mono truncate flex-1">{file.path}</span>
                        <span className="text-xs text-bolt-elements-textSecondary ml-2">{formatSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="repoName" className="text-sm text-gray-600 dark:text-gray-400">
                      Repository Name
                    </label>
                    <Input
                      id="repoName"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="e.g., my-awesome-project"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="private" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Private Repository
                    </label>
                    <Switch
                      id="private"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                      className={classNames(
                        'relative inline-flex h-5 w-9 items-center rounded-full',
                        'transition-colors duration-200',
                        isPrivate ? 'bg-purple-500' : 'bg-bolt-elements-background-depth-4',
                      )}
                    />
                  </div>

                  {recentRepos.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Recent Repositories</label>
                      <div className="space-y-2">
                        {recentRepos.map((repo) => (
                          <motion.button
                            key={repo.full_name}
                            type="button"
                            onClick={() => setRepoName(repo.name)}
                            className="w-full p-3 text-left rounded-lg bg-bolt-elements-background-depth-2 dark:bg-bolt-elements-background-depth-3 hover:bg-bolt-elements-background-depth-3 dark:hover:bg-bolt-elements-background-depth-4 transition-colors group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="i-ph:git-repository w-4 h-4 text-purple-500" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-500">
                                  {repo.name}
                                </span>
                              </div>
                              {repo.private && (
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
                                  Private
                                </span>
                              )}
                            </div>
                            {repo.description && (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {repo.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                              {repo.language && (
                                <span className="flex items-center gap-1">
                                  <div className="i-ph:code w-3 h-3" />
                                  {repo.language}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <div className="i-ph:star w-3 h-3" />
                                {repo.stargazers_count.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="i-ph:git-fork w-3 h-3" />
                                {repo.forks_count.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="i-ph:clock w-3 h-3" />
                                {new Date(repo.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isFetchingRepos && (
                    <div className="flex items-center justify-center py-4 text-gray-500 dark:text-gray-400">
                      <div className="i-ph:spinner-gap-bold animate-spin w-4 h-4 mr-2" />
                      Loading repositories...
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    <motion.button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 rounded-lg bg-[#F5F5F5] dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-[#E5E5E5] dark:hover:bg-[#252525] text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={classNames(
                        'flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm inline-flex items-center justify-center gap-2',
                        isLoading ? 'opacity-50 cursor-not-allowed' : '',
                      )}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? (
                        <>
                          <div className="i-ph:spinner-gap-bold animate-spin w-4 h-4" />
                          Pushing...
                        </>
                      ) : (
                        <>
                          <div className="i-ph:git-branch w-4 h-4" />
                          Push to GitHub
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </Dialog.Content>
          </motion.div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
