import type { Message } from 'ai';
import React, { Fragment, useState, useEffect, useMemo, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { useLocation } from '@remix-run/react';
import { db, chatId } from '~/lib/persistence/useChatHistory';
import { forkChat } from '~/lib/persistence/db';
import { toast } from 'react-toastify';
import WithTooltip from '~/components/ui/Tooltip';

const BATCH_SIZE = 25; // Batch size for loading older messages
const INITIAL_MESSAGES = 10; // Number of most recent messages to show initially

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.memo(
  React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
    const { id, isStreaming = false, messages = [] } = props;
    const location = useLocation();
    const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const loadingTimeoutRef = useRef<NodeJS.Timeout>();
    const observerRef = useRef<IntersectionObserver>();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load most recent messages first
    useEffect(() => {
      const startIdx = Math.max(0, messages.length - INITIAL_MESSAGES);
      const initialMessages = messages.slice(startIdx);
      setVisibleMessages(initialMessages);

      // Scroll to bottom after initial load
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }, [messages]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
      if (messages.length > 0 && visibleMessages.length > 0) {
        const isAtBottom = messages[messages.length - 1] === visibleMessages[visibleMessages.length - 1];

        if (isAtBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, [messages, visibleMessages]);

    // Load older messages when scrolling up
    useEffect(() => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];

          if (firstEntry.isIntersecting && !isLoading && visibleMessages.length < messages.length) {
            setIsLoading(true);

            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }

            // Calculate the range for loading older messages
            const endIdx = messages.length - visibleMessages.length;
            const startIdx = Math.max(0, endIdx - BATCH_SIZE);
            const olderMessages = messages.slice(startIdx, endIdx);

            // Update messages after a small delay
            setTimeout(() => {
              setVisibleMessages((prev) => [...olderMessages, ...prev]);
            }, 100);

            loadingTimeoutRef.current = setTimeout(() => {
              setIsLoading(false);
            }, 300);
          }
        },
        { threshold: 0.5 },
      );

      const loadingTrigger = document.getElementById('loading-trigger');

      if (loadingTrigger) {
        observerRef.current.observe(loadingTrigger);
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }, [visibleMessages, messages, isLoading]);

    const handleRewind = (messageId: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('rewindTo', messageId);
      window.location.search = searchParams.toString();
    };

    const handleFork = async (messageId: string) => {
      try {
        if (!db || !chatId.get()) {
          toast.error('Chat persistence is not available');
          return;
        }

        const urlId = await forkChat(db, chatId.get()!, messageId);
        window.location.href = `/chat/${urlId}`;
      } catch (error) {
        toast.error('Failed to fork chat: ' + (error as Error).message);
      }
    };

    // Memoize message rendering
    const renderedMessages = useMemo(() => {
      return visibleMessages.map((message, index) => {
        const { role, content, id: messageId, annotations } = message;
        const isUserMessage = role === 'user';
        const isFirst = index === 0;
        const isLast = index === visibleMessages.length - 1;
        const isHidden = annotations?.includes('hidden');

        // Create a truly unique key combining multiple identifiers
        const uniqueKey = `${messageId || 'msg'}-${role}-${index}-${content.slice(0, 8)}`;

        if (isHidden) {
          return <Fragment key={uniqueKey} />;
        }

        return (
          <div
            key={uniqueKey}
            className={classNames('flex gap-4 p-6 w-full rounded-[calc(0.75rem-1px)]', {
              'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
              'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent': isStreaming && isLast,
              'mt-4': !isFirst,
            })}
          >
            {isUserMessage && (
              <div className="flex items-center justify-center w-[34px] h-[34px] overflow-hidden bg-white text-gray-600 rounded-full shrink-0 self-start">
                <div className="i-ph:user-fill text-xl"></div>
              </div>
            )}
            <div className="grid grid-col-1 w-full">
              {isUserMessage ? (
                <UserMessage content={content} />
              ) : (
                <AssistantMessage content={content} annotations={message.annotations} />
              )}
            </div>
            {!isUserMessage && messageId && (
              <div className="flex gap-2 flex-col lg:flex-row">
                <WithTooltip content="Revert to this message">
                  <button
                    onClick={() => handleRewind(messageId)}
                    className={classNames(
                      'i-ph:arrow-u-up-left',
                      'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                    )}
                  />
                </WithTooltip>

                <WithTooltip content="Fork chat from this message">
                  <button
                    onClick={() => handleFork(messageId)}
                    className={classNames(
                      'i-ph:git-fork',
                      'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                    )}
                  />
                </WithTooltip>
              </div>
            )}
          </div>
        );
      });
    }, [visibleMessages, isStreaming]);

    return (
      <>
        <div id={id} ref={ref} className={props.className}>
          {visibleMessages.length < messages.length && (
            <div
              id="loading-trigger"
              className={classNames(
                'text-center w-full text-bolt-elements-textSecondary py-4',
                'transition-opacity duration-300',
                {
                  'opacity-100': isLoading,
                  'opacity-0': !isLoading,
                },
              )}
            >
              <div className="i-svg-spinners:3-dots-fade text-4xl"></div>
            </div>
          )}
          {renderedMessages}
          <div ref={messagesEndRef} />
          {isStreaming && (
            <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4"></div>
          )}
        </div>
      </>
    );
  }),
);
