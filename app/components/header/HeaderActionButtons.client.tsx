import { useStore } from '@nanostores/react';
import useViewport from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { indexingStore } from '~/lib/stores/indexing';
import { classNames } from '~/utils/classNames';
import { toast } from 'sonner';
import { generateId } from '~/utils/fileUtils';
import type { BoltAction } from '~/types/actions';

interface HeaderActionButtonsProps {}

export function HeaderActionButtons({}: HeaderActionButtonsProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const { showChat } = useStore(chatStore);
  const indexingState = useStore(indexingStore.state);
  const isSmallViewport = useViewport(1024);
  const canHideChat = showWorkbench || !showChat;

  const handleIndexing = async () => {
    try {
      // Start indexing
      await indexingStore.indexCodebase();

      // Get indexed files
      const indexedFiles = indexingStore.getAllIndexedFiles();

      // Create artifact for indexed files
      const messageId = generateId();
      const artifactId = generateId();

      // Add artifact to workbench
      workbenchStore.addArtifact({
        messageId,
        id: artifactId,
        title: 'Indexed Files',
        type: 'shell',
      });

      // Create file actions for each indexed file
      for (const file of Object.values(indexedFiles)) {
        const fileAction: BoltAction = {
          type: 'file',
          filePath: file.path,
          content: file.content,
        };

        // Add file action to workbench
        workbenchStore.addAction({
          messageId,
          actionId: generateId(),
          artifactId,
          action: fileAction,
        });
      }

      // Create summary shell action
      const summaryAction: BoltAction = {
        type: 'shell',
        content: `Indexed ${Object.keys(indexedFiles).length} files`,
      };

      // Add summary action to workbench
      workbenchStore.addAction({
        messageId,
        actionId: generateId(),
        artifactId,
        action: summaryAction,
      });

      toast.success('Codebase indexed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to index codebase');
    }
  };

  return (
    <div className="flex">
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button
          active={showChat}
          disabled={!canHideChat || isSmallViewport}
          onClick={() => {
            if (canHideChat) {
              chatStore.setKey('showChat', !showChat);
            }
          }}
        >
          <div className="i-bolt:chat text-sm" />
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor" />
        <Button
          active={showWorkbench}
          onClick={() => {
            if (showWorkbench && !showChat) {
              chatStore.setKey('showChat', true);
            }

            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="i-ph:code-bold" />
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor" />
        <Button active={indexingState.isIndexing} disabled={indexingState.isIndexing} onClick={handleIndexing}>
          {indexingState.isIndexing ? 'Indexing...' : 'Index'}
        </Button>
      </div>
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
}

function Button({ active = false, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button
      className={classNames('flex items-center p-1.5', {
        'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary':
          !active,
        'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': active && !disabled,
        'bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed':
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
