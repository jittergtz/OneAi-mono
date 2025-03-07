
"use client"

import { Cog, Send, SendIcon } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// Message type definition
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

function GeminiChat() {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // For debugging in Electron
  useEffect(() => {
    console.log("Component mounted, environment check:")
    console.log(
      "Is Electron:",
      typeof window !== "undefined" &&
        window.navigator.userAgent.toLowerCase().indexOf(" electron/") > -1
    )
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("triggerd button")
    if (!input.trim()) return

    const userMessageId = `user-${Date.now()}`
    const assistantMessageId = `assistant-${Date.now()}`

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: input },
    ])

    // Clear input and set loading state
    setInput("")
    setIsLoading(true)

    try {
      console.log("Sending request to API...")

      // Add initial assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ])

      // Use old-school XHR for maximum compatibility with Electron
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/gemini", true)
      xhr.setRequestHeader("Content-Type", "application/json")

      // Track response building
      let fullResponse = ""

      xhr.onreadystatechange = function () {
        // readyState 3 means "LOADING" - data is being received
        if (xhr.readyState === 3) {
          // Get only the new part of the response
          const newContent = xhr.responseText.slice(fullResponse.length)
          if (newContent) {
            fullResponse = xhr.responseText

            // Update message with new content
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + newContent }
                  : msg
              )
            )
          }
        }

        // readyState 4 means "DONE"
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) {
            console.error("API error:", xhr.status, xhr.statusText)
            // Update with error message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content:
                        "Sorry, there was an error processing your request.",
                    }
                  : msg
              )
            )
          }
          setIsLoading(false)
        }
      }

      // Handle network errors
      xhr.onerror = function () {
        console.error("Network error occurred")
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "Network error. Please check your connection.",
                }
              : msg
          )
        )
        setIsLoading(false)
      }

      // Send the request with proper JSON payload
      xhr.send(JSON.stringify({ prompt: input }))
    } catch (error) {
      console.error("Error sending request:", error)
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== assistantMessageId),
        {
          id: assistantMessageId,
          role: "assistant",
          content: "An error occurred. Please try again.",
        },
      ])
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full to-transparent  mx-auto">
      <div className=" relative">
        <div className=" fixed   border-b border-neutral-600 p-1 top-0 w-full">
          <form autoFocus onSubmit={handleSubmit} className="flex w-full gap-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-transparent  placeholder:text-[#d9e1ea94] outline-none border-neutral-500 p-2 "
            />
            <button
              className="hover:bg-neutral-900/70 p-3 rounded-md bg-neutral-900/40"
              type="submit"
            >
              <SendIcon size={14} />
            </button>
          </form>
        </div>
        <div className="space-y-4  mt-12  w-full h-80 overflow-x-scroll p-2 pt-2">
          {messages.length === 0 ? (
            <div className="flex justify-center">
              <div className="flex mt-20  justify-center w-full max-w-sm flex-col gap-2">
                <h1 className="text-center   text-4xl text-[#ffffff5a] ">
                  One
                </h1>
                <p className="text-center pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#050505] via-[#9b9b9bcb] to-[#000000]">
                  Ask Anything
                </p>
                <div className="flex justify-center items-center gap-2">
                  <div className="size-14 bg-black/20 flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black text-white/30 text-sm rounded-xl">
                    whop
                  </div>
                  <div className="size-16 bg-black/20 flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black  text-white/30 text-sm rounded-xl">
                    AI
                  </div>
                  <div className="size-16 bg-black/20 flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black  text-white/30 text-sm rounded-xl">
                    Last
                  </div>
                  <div className="size-14 bg-black/20 flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black  text-white/30 text-sm rounded-xl">
                    New
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#242424] text-white/80"
                      : "bg-gray-100 dark:bg-[#ffffff1c] text-neutral-100"
                  }`}
                >
                  {message.content ||
                    (message.role === "assistant" &&
                      isLoading &&
                      "Thinking...")}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className=" dark:bg-[#212121c1] bg-[#adadadc1] border-[#ffffff1d] flex px-3 p-1 h-8 items-center justify-end gap-5">
        <Link
          href={"/settings"}
          className="flex gap-1 text-xs items-center text-white/40 hover:text-white/80"
        >
          new converstaion
        </Link>
        <Link href={"/settings"} className="hover:text-white/80 text-white/40">
          <Cog size={14} />
        </Link>
      </div>
    </div>
  )
}

export default GeminiChat
