"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Cog, SendIcon } from "lucide-react"

const mockConversations = [
  {
    question: "Tell me about quantum theory?",
    answer:
      "Quantum theory describes the behavior of particles on the atomic and subatomic level, introducing concepts like superposition and entanglement.",
  },
  {
    question: "How does artificial intelligence work?",
    answer:
      "AI works by processing vast amounts of data using algorithms and models to make decisions, learn patterns, and predict outcomes.",
  },
  {
    question: "What is the meaning of life?",
    answer:
      "The meaning of life varies by perspective—philosophers, scientists, and religions all offer different interpretations.",
  },
]

function ChatMock() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputText, setInputText] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [phase, setPhase] = useState("typing")

  useEffect(() => {
    let timer
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
    <div className="w-full mt-20 relative h-[300px] overflow-hidden max-w-lg mx-auto border border-[#4f4f4fae] bg-[#47474717] rounded-lg shadow-lg">
      <div className="border-b border-neutral-600 p-1 top-0 w-full">
        <form autoFocus onSubmit={(e) => e.preventDefault()} className="flex w-full gap-2">
          <input
            disabled
            value={inputText || "Typing..."}
            placeholder="Type your message..."
            className="flex-1 bg-transparent placeholder:text-[#d9e1ea94] outline-none border-neutral-500 p-2"
          />
          <button
            className="hover:bg-neutral-900/70 p-3 rounded-md bg-neutral-900/40"
            type="submit"
          >
            <SendIcon size={14} />
          </button>
        </form>
      </div>
   
      {isLoading && (
        <motion.div
          className="text-white/70 bg-[#ffffff3f] p-3 m-4 rounded-lg flex items-center"
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
          className="text-white bg-[#ffffff3f] p-3 m-4 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {mockConversations[currentIndex].answer}
        </motion.div>
      )}
      <div className="bg-[#2121216a] absolute bottom-0 w-full border-[#ffffff1d] flex px-3 p-1 h-8 items-center justify-end gap-5">
        <button className="flex gap-1 text-xs items-center text-white/40 hover:text-white/80">
          new conversation
        </button>
        <button className="hover:text-white/80 text-white/40">
          <Cog size={14} />
        </button>
      </div>
    </div>
  )
}

export default ChatMock