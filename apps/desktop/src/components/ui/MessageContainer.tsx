import React from 'react'
import { TextShimmer } from '../../../components/motion-primitives/text-shimmer'
import ReactMarkdown from 'react-markdown';

function MessageContainer({ message, isLoading }: { message: any; isLoading: boolean }) {
  return (
  <>
      {message.content ? (
              <div className="overflow-hidden ">
              <ReactMarkdown>{message.content}</ReactMarkdown> 


                {/* Conditionally render the grounding search entry point */}

    
                
     
  
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