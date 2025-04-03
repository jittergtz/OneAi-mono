"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Box, Cog, Globe, SendIcon } from "lucide-react"

const mockConversations = [
  {
    question: "Tell me about quantum theory?",
    answer:
      "Quantum theory describes the behavior of particles on the atomic and subatomic level, introducing concepts like superposition and entanglement.",
  },
  {
    question: "How does artificial intelligence work?",
    answer:
      "AI works by processing vast amounts of data using algorithms and models to make decisions, learn patterns, and predict outcomes. Machine learning and deep learning are common AI techniques.",
  },
  {
    question: "what is serverless ?",
    answer:
      "Serverless computing is a cloud computing execution model where the cloud provider dynamically manages the allocation of machine resources. Here's a breakdown of key aspectsNo Server Management: Developers don't have to provision, scale, or maintain servers. The cloud provider handles all of this.Event-Driven: Serverless functions are typically triggered by events, such as HTTP requests, database updates, queue messages, or scheduled jobs.Pay-as-you-go: You only pay for the compute time consumed by your functions. There are no charges when the function is idle. Automatic Scaling: The cloud provider automatically.",
  },
]

function ChatMock() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputText, setInputText] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [phase, setPhase] = useState("typing")

  useEffect(() => {
    let timer: any
    if (phase === "typing") {
      let i = 0
      setShowAnswer(false)
      setIsLoading(false)
      
      timer = setInterval(() => {
        if (i < mockConversations[currentIndex].question.length) {
          setInputText(
            mockConversations[currentIndex].question.slice(0, i + 1)
          )
          i++
        } else {
          clearInterval(timer)
          setTimeout(() => {
            // Simulate form submission
            setPhase("loading")
            setIsLoading(true)
          }, 1000)
        }
      }, 50)
    } else if (phase === "loading") {
      // Show loading state for 1.5 seconds
      setTimeout(() => {
        setPhase("responding")
        setIsLoading(false)
      }, 1500)
    } else if (phase === "responding") {
      // Show the answer in the response area
      setShowAnswer(true)
      
      // Setup the transition to the next question
      setTimeout(() => {
        setPhase("typing")
        setCurrentIndex((prev) => (prev + 1) % mockConversations.length)
        setInputText("")
      }, 4000)
    }
    return () => clearInterval(timer)
  }, [phase, currentIndex])

  return (
    <div className="w-full  relative h-[250px] md:h-[400px] overflow-hidden max-w-lg md:max-w-[700px] mx-auto border border-[#4f4f4f48] bg-gradient-to-tl from-[#221e22] from-30% to-[#111010] to-80% rounded-md shadow-lg">
      <div className="border-b border-[#4f4f4f48] p-0.5 top-0 w-full">
        <form autoFocus onSubmit={(e) => e.preventDefault()} className="flex w-full gap-2">
          <input
            disabled
            value={inputText || "Typing..."}
            placeholder="Type your message..."
            className="flex-1 text-xs bg-transparent text-[#ffffffe2] placeholder:text-[#d9e1ea94] outline-none border-neutral-500 p-2"
          />
          <button
            className="hover:bg-neutral-900/70 p-2 rounded-md bg-neutral-900/40"
            type="submit"
          >
            <SendIcon size={10} className="text-white/50" />
          </button>
        </form>
      </div>
   
      {isLoading && (
        <motion.div
          className="text-white/70 bg-[#2a292947] w-28 mx-3 p-2 m-4 text-[10px] rounded-md flex items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mr-2 animate-pulse">Thinking...</div>
          <div className="flex space-x-1">
            <div className="h-1 w-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="h-1 w-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="h-1 w-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </motion.div>
      )}

      {showAnswer && (
        <motion.div
          className="text-white/70 bg-[#2a292947] overflow-hidden mx-3 p-2 m-4 rounded-md text-[10px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {mockConversations[currentIndex].answer}
        </motion.div>
      )}
      <div className="bg-[#21212112] absolute bottom-0 w-full  flex px-3 p-1 h-5 items-center justify-between gap-2">
      <div className="flex items-center ">
            <span className="dark:text-white/40 text-black/40 text-[6px]">
              gemini-2.0-flash
            </span>
            <button 
              className={`text-[7px] flex items-center gap-1 -nbg-neutral-600/20 text-neutral-600 hover:texteutral-300  p-0.5 rounded-full px-2`} >
              Search <Globe className="size-2"/>
            </button>
            <button className="text-[7px] flex items-center gap-1 bg-neutral-600/20 text-neutral-600 hover:text-amber-500 hover:bg-amber-500/20 p-0.5 rounded-full px-2">
              Reason <Box className="size-2" strokeWidth={1.75} />
            </button>
          </div>
       
      
         
        <div className="flex gap-2">
        <button className="flex gap-1 text-[7px] items-center text-white/40 hover:text-white/80">
          new conversation
        </button>
        <button className="hover:text-white/80 text-white/40">
          <Cog size={10} />
        </button>
      </div>
      </div>
    </div>
  )
}

export default ChatMock