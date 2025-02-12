import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import { createPortal } from 'react-dom';

interface SupabaseAlertProps {
  alert: { description?: string; source?: string };
  clearAlert: () => void;
  postMessage: (message: string) => void;
}

const SUPABASE_PROMPT = `You are a Supabase expert specializing in database architecture and cloud infrastructure.

<system_services>
1. PostgreSQL Database:
   - Schema design & optimization
   - Indexing strategies
   - Query performance tuning
   - Row Level Security (RLS) policies
   - Database extensions

2. Authentication:
   - OAuth providers configuration
   - Email/password auth flows
   - Session management
   - Custom JWT claims

3. Realtime:
   - Subscription channels
   - Presence tracking
   - Broadcast updates

4. Storage:
   - Bucket configuration
   - File uploads/downloads
   - Access controls
   - Image transformations

5. Edge Functions:
   - TypeScript development
   - Deployment workflows
   - Environment variables
   - Request handling
</system_services>

<architecture_constraints>
- All database operations must include RLS policies
- Use parameterized queries to prevent SQL injection
- Implement proper index strategies for query patterns
- Follow least-privilege principle for database roles
- Use connection pooling for serverless environments
- Enable database backups for production instances
</architecture_constraints>

<development_guidelines>
1. For database operations:
   - Use Supabase JavaScript/TypeScript client
   - Generate types from database schema
   - Implement error handling for all queries
   - Use transactions for bulk operations

2. For authentication:
   - Implement server-side session validation
   - Use secure cookie storage
   - Handle token refresh workflows

3. For file storage:
   - Set appropriate CORS policies
   - Use signed URLs for sensitive files
   - Implement upload validation

4. For Edge Functions:
   - Keep functions stateless
   - Implement proper error logging
   - Use environment variables for secrets
</development_guidelines>

Please help me integrate these Supabase services using my credentials:
URL: {url}
Key: {key}

<integration_steps>
1. Select services to implement (database/auth/storage/realtime/functions)
2. Configure TypeScript client with proper typings
3. Implement environment-specific security rules
4. Set up database schema with migrations
5. Create necessary RLS policies
6. Implement service-specific error handling
7. Add monitoring and logging
</integration_steps>

Provide code samples with:
- Type-safe database client configuration
- Example CRUD operations
- Authentication flow implementation
- Realtime subscription setup
- Storage upload/download examples
- Edge Function boilerplate
`;

export default function SupabaseAlert({ alert, clearAlert, postMessage }: SupabaseAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [selectedSubOptions, setSelectedSubOptions] = useState<Record<string, string[]>>({});
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const integrationOptions = {
    'Database': {
      title: 'Database Features',
      options: [
        'Create RLS policies',
        'Create functions',
        'Create migration',
        'Postgres SQL Style Guide'
      ]
    },
    'Integration': {
      title: 'Integration Features',
      options: [
        'Bootstrap Next.js app with Supabase Auth',
        'Writing Supabase Edge Functions'
      ]
    }
  };

  const handleSubOptionChange = (category: string, option: string, checked: boolean) => {
    setSelectedSubOptions(prev => ({
      ...prev,
      [category]: checked
        ? [...(prev[category] || []), option]
        : (prev[category] || []).filter(item => item !== option)
    }));
  };

  const handleSubmit = () => {
    const formattedPrompt = SUPABASE_PROMPT
      .replace('{url}', supabaseUrl)
      .replace('{key}', supabaseKey);
    
    const selectedFeatures = Object.entries(selectedSubOptions)
      .map(([category, options]) => ({
        category,
        options: options.join(', ')
      }))
      .filter(item => item.options.length > 0);

    const visibleMessage = `Starting integration for: ${selectedFeatures.map(f => `${f.category} (${f.options})`).join('; ')}`;
    const encodedPrompt = btoa(formattedPrompt);
    
    postMessage(`${visibleMessage}\u200B${encodedPrompt}`);
    clearAlert();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] shadow-xl max-w-2xl mx-auto overflow-hidden"
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2E2E2E]">
            <div className="flex items-center gap-3">
              <img
                src="/supabase/supabase-logo-icon.png"
                alt="Supabase"
                className="w-6 h-6 object-contain"
              />
              <h3 className="text-sm font-medium text-white">
                {expanded ? "Configure Supabase Integration" : "Supabase Integration Detected"}
              </h3>
            </div>
            <button
              onClick={clearAlert}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <div className="i-ph:x text-lg" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {expanded ? (
              <div className="space-y-4">
                {/* Credentials Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-400" htmlFor="supabase-url">
                      Project URL
                    </label>
                    <input
                      id="supabase-url"
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xxx.supabase.co"
                      className="w-full px-3 py-2 text-sm rounded bg-[#2E2E2E] border border-[#404040] focus:border-[#3ECF8E] outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-400" htmlFor="supabase-key">
                      Project API Key
                    </label>
                    <input
                      id="supabase-key"
                      type="text"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="your-api-key"
                      className="w-full px-3 py-2 text-sm rounded bg-[#2E2E2E] border border-[#404040] focus:border-[#3ECF8E] outline-none text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Features Button */}
                <div>
                  <label className="block text-xs mb-2 text-gray-400 font-medium">
                    Features
                  </label>
                  <button
                    onClick={() => setShowFeaturesModal(true)}
                    className="w-full px-3 py-2 text-sm rounded bg-[#2E2E2E] border border-[#404040] hover:border-[#3ECF8E] text-white flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <div className="i-ph:list-plus text-base" />
                      Select Features
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {Object.values(selectedSubOptions).reduce((acc, curr) => acc + curr.length, 0)} selected
                      </span>
                      <div className="i-ph:caret-right text-xs opacity-70" />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-white">We detected that your project needs a database.</p>
                <p className="mt-1 text-gray-400">Would you like to integrate Supabase?</p>
                {alert.description && (
                  <div className="mt-3 text-xs p-2 bg-[#2E2E2E] rounded text-gray-400">
                    {alert.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#2E2E2E] bg-[#1C1C1C]">
            {expanded ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded text-sm font-medium bg-[#3ECF8E] text-black hover:bg-[#3ECF8E]/90 flex items-center gap-1.5"
                >
                  <div className="i-ph:check-circle" />
                  Start Integration
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  className="px-4 py-2 rounded text-sm font-medium bg-[#2E2E2E] text-white hover:bg-[#404040]"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setExpanded(true)}
                  className="px-4 py-2 rounded text-sm font-medium bg-[#3ECF8E] text-black hover:bg-[#3ECF8E]/90 flex items-center gap-1.5"
                >
                  <div className="i-ph:plus-circle" />
                  Configure Integration
                </button>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded text-sm font-medium bg-[#2E2E2E] text-white hover:bg-[#404040] flex items-center gap-2"
                >
                  <img
                    src="/supabase/supabase-logo-icon.png"
                    alt="Supabase"
                    className="w-4 h-4 object-contain opacity-80"
                  />
                  Learn More
                </a>
              </>
            )}
          </div>
        </div>

        {/* Features Modal */}
        {showFeaturesModal && createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1C1C1C] rounded-lg border border-[#2E2E2E] shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-[#2E2E2E] bg-[#1C1C1C] z-10">
                <div className="flex items-center gap-3">
                  <img
                    src="/supabase/supabase-logo-icon.png"
                    alt="Supabase"
                    className="w-5 h-5 object-contain"
                  />
                  <h3 className="text-sm font-medium text-white">Integration Features</h3>
                </div>
                <button
                  onClick={() => setShowFeaturesModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <div className="i-ph:x text-lg" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
                <div className="grid gap-4">
                  {Object.entries(integrationOptions).map(([category, { title, options }]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between sticky top-0 bg-[#1C1C1C] py-2 -mt-2 z-[1]">
                        <div className="flex items-center gap-2">
                          <div className={classNames(
                            "text-base",
                            {
                              "i-ph:database-duotone": category === 'Database',
                              "i-ph:code-duotone": category === 'Integration'
                            }
                          )} />
                          <h4 className="text-sm font-medium text-white">{title}</h4>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-400 hover:text-white cursor-pointer">
                          <span>Select All</span>
                          <input
                            type="checkbox"
                            checked={options.every(opt => (selectedSubOptions[category] || []).includes(opt))}
                            onChange={(e) => {
                              setSelectedSubOptions(prev => ({
                                ...prev,
                                [category]: e.target.checked ? [...options] : []
                              }));
                            }}
                            className="w-3 h-3 rounded border-[#404040] text-[#3ECF8E] focus:ring-[#3ECF8E] focus:ring-offset-0"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-start gap-2 text-[11px] text-gray-400 hover:text-white cursor-pointer p-1.5 rounded hover:bg-[#404040]"
                          >
                            <input
                              type="checkbox"
                              checked={(selectedSubOptions[category] || []).includes(option)}
                              onChange={(e) => handleSubOptionChange(category, option, e.target.checked)}
                              className="w-3 h-3 rounded border-[#404040] text-[#3ECF8E] focus:ring-[#3ECF8E] focus:ring-offset-0 mt-0.5"
                            />
                            <span className="leading-tight" title={option}>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex justify-end gap-2 p-4 border-t border-[#2E2E2E] bg-[#1C1C1C] z-10">
                <button
                  onClick={() => setShowFeaturesModal(false)}
                  className="px-4 py-2 rounded text-sm font-medium bg-[#3ECF8E] text-black hover:bg-[#3ECF8E]/90"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export { SupabaseAlert }; 