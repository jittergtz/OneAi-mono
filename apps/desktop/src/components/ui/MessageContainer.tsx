import React from 'react'
import { TextShimmer } from '../../../components/motion-primitives/text-shimmer'
import ReactMarkdown from 'react-markdown';

function MessageContainer({ message, isLoading }: { message: any; isLoading: boolean }) {
  return (
  <>
      {message.content ? (
              <div className="overflow-hidden">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              <p className="text-xs text-neutral-400  mb-1">
                      Sources:
                      {message.sources && message.sources.length > 0 ? (
                        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                          <div className="flex flex-col gap-1">
                            {message.sources.map((source, index) => (
                              <a
                                key={index}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                              >
                                {source.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      ):(<p className="text-xs text-neutral-400">No sources found</p>)}
                    </p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    
                    <div className="flex flex-col gap-1">
                      {message.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                        >
                          {source.title}
                        </a>
                      ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    message.role === "assistant" &&
    isLoading && (
      <TextShimmer className="font-mono text-sm" duration={1}>
        Thinking...
      </TextShimmer>
    )
  )}</>
  )
}

export default MessageContainer