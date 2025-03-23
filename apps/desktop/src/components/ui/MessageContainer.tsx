import React from 'react'
import { TextShimmer } from '../../../components/motion-primitives/text-shimmer'
import ReactMarkdown from 'react-markdown';

function MessageContainer({ message, isLoading }: { message: any; isLoading: boolean }) {
  return (
  <>
      {message.content ? (
              <div className="overflow-hidden">
              <ReactMarkdown>{message.content}</ReactMarkdown> 


                {/* Conditionally render the grounding search entry point */}

        <div className="mt-2">
          <p className="font-semibold">Search Preview:</p>
          <div dangerouslySetInnerHTML={{ __html: message.groundingSearchEntryPoint }} />
        </div>

              <p className="text-xs text-neutral-400  mb-1">
                      Sources:
                    
                      {message ?   (
                        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                          <div className="flex flex-col gap-1">
                          
                             
                          </div>
                        </div>
                      ):(<p className="text-xs text-neutral-400">No sources found</p>)}
                    </p>
                
     
  
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