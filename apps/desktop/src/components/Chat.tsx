"use client"

import { useTheme } from "@/app/ThemeProvider"
import { Box, Cog, Globe, Send, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ConversationSelect } from "./Conversations"
import DOMPurify from "dompurify";

// Message type definition
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

// Conversation type definition
type Conversation = {
  id: number
  timestamp: string
  messages: Message[]
  name?: string
}

function GeminiChat() {
  // State management
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages")
      return savedMessages ? JSON.parse(savedMessages) : []
    }
    return []
  })
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("conversationHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [searchEnabled, setSearchEnabled] = useState(false);

  // Handle toggle search mode
  const toggleSearchMode = () => {
    setSearchEnabled(prevState => !prevState);
    // Optional: Show a toast or notification to the user
    // toast(`Search mode ${!searchEnabled ? 'enabled' : 'disabled'}`);
  };

  // Save changes to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
      if (currentConversationId !== null) {
        const conversationHistory = JSON.parse(
          localStorage.getItem("conversationHistory") || "[]"
        )
        const updatedHistory = conversationHistory.map((conv: Conversation) => {
          if (conv.id === currentConversationId) {
            return { ...conv, messages }
          }
          return conv
        })
        localStorage.setItem("conversationHistory", JSON.stringify(updatedHistory))
      }
    }
  }, [messages, currentConversationId])

  // Handle new conversation
  const handleNewConversation = () => {
    if (messages.length > 0) {
      const conversationHistory = JSON.parse(
        localStorage.getItem("conversationHistory") || "[]"
      )
      if (currentConversationId === null) {
        const newConversation = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          messages,
          name: "New conversation",
        }
        localStorage.setItem(
          "conversationHistory",
          JSON.stringify([...conversationHistory, newConversation])
        )
      }
    }
    setMessages([])
    setCurrentConversationId(null)
    localStorage.removeItem("chatMessages")
    const updatedHistory = JSON.parse(
      localStorage.getItem("conversationHistory") || "[]"
    )
    setConversations(updatedHistory)
  }

  // Load conversation from history
  const loadConversationFromHistory = (id: number | null) => {
    if (id === null) {
      setMessages([])
      setCurrentConversationId(null)
      localStorage.removeItem("chatMessages")
      return
    }
    const history = JSON.parse(
      localStorage.getItem("conversationHistory") || "[]"
    )
    const conversation = history.find((conv: Conversation) => conv.id === id)
    if (conversation) {
      setMessages(conversation.messages)
      setCurrentConversationId(id)
      localStorage.setItem("chatMessages", JSON.stringify(conversation.messages))
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message function with search flag support
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessageId = `user-${Date.now()}`
    const assistantMessageId = `assistant-${Date.now()}`
    const isFirstMessage = messages.length === 0
    
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: inputValue },
    ])
    
    // Create a new conversation if needed
    if (isFirstMessage && currentConversationId === null) {
      const newConversationId = Date.now()
      setCurrentConversationId(newConversationId)
      const conversationHistory = JSON.parse(
        localStorage.getItem("conversationHistory") || "[]"
      )
      const newConversation = {
        id: newConversationId,
        timestamp: new Date().toISOString(),
        messages: [{ id: userMessageId, role: "user", content: inputValue }],
        name: inputValue.slice(0, 30) + (inputValue.length > 30 ? "..." : ""),
      }
      localStorage.setItem(
        "conversationHistory",
        JSON.stringify([...conversationHistory, newConversation])
      )
    }
    
    setInputValue("")
    setIsLoading(true)
    
    try {
      console.log("Sending request to API...")
      
      // Add a placeholder assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ])
      
      // Use XHR for streaming
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/gemini", true)
      xhr.setRequestHeader("Content-Type", "application/json")
      
      let fullResponse = ""
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 3) {
          const newContent = xhr.responseText.slice(fullResponse.length)
          if (newContent) {
            fullResponse = xhr.responseText
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + newContent }
                  : msg
              )
            )
          }
        }
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) {
            console.error("API error:", xhr.status, xhr.statusText)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content:
                        "Sorry, there was an error processing your request. Maybe you reached your daily free limit. Please try again later.",
                    }
                  : msg
              )
            )
          }
          setIsLoading(false)
        }
      }
      
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
      
      // Send conversation context under the property "history" and include search flag
      const recentMessages = messages.slice(-10)
      const payload = JSON.stringify({ 
        prompt: inputValue, 
        history: recentMessages,
        useSearch: searchEnabled
      })
      xhr.send(payload)
      
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("triggered button")
    await sendMessage()
  }

  return (
    <div className="w-full to-transparent mx-auto">
      <div className="relative">
        <div className={`fixed border-b p-1 top-0 w-full ${theme.borderColor}`}>
          <form autoFocus onSubmit={handleSubmit} className="flex w-full gap-2">
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-transparent dark:text-[#ffffffe5] text-[#171717e5] placeholder:text-[#2c2c2d94] dark:placeholder:text-[#d9e1ea94] outline-none border-neutral-500 p-2"
            />
            <button
              disabled={isLoading}
              className="dark:hover:bg-neutral-900/70 hover:bg-neutral-100/70 p-3 rounded-md dark:text-white/40 text-black/40"
              type="submit"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
        <div className="space-y-4 mt-12 w-full h-[370px] overflow-x-scroll p-2 pt-2">
          {messages.length === 0 ? (
            <div className="flex justify-center">
              <div className="flex mt-20 justify-center w-full max-w-sm flex-col gap-2">
                <h1 className="text-center text-4xl dark:text-[#ffffff5a] text-[#5757575a]">
                  One
                </h1>
                <p className="text-center pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#050505] via-[#9b9b9bcb] to-[#000000]">
                  Ask Anything
                </p>
                <div className="flex justify-center items-center gap-2">
                  <button className="size-14 bg-black/20 duration-200 hover:bg-neutral-800 cursor-pointer flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black text-white/30 text-sm rounded-xl">
                    Image
                  </button>
                  <button className="size-16 bg-black/20 duration-200 hover:bg-neutral-800 cursor-pointer flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black text-white/30 text-sm rounded-xl">
                    Voice
                  </button>
                  <button className="size-16 bg-black/20 duration-200 hover:bg-neutral-800 cursor-pointer flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black text-white/30 text-sm rounded-xl">
                    Reason
                  </button>
                  <button className="size-14 bg-black/20 duration-200 hover:bg-neutral-800 cursor-pointer flex items-center justify-center border border-[#6a6a6a2d] shadow-sm shadow-black text-white/30 text-sm rounded-xl">
                    New
                  </button>
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
                <div className={`flex gap-2 ${
                  message.role === "user" ? "items-center" : "items-start"
                }`}>
                  {message.role === "assistant" ? (
                    <Sparkles className="text-orange-600 size-5 bg-red-500/20 p-1 rounded-md" />
                  ) : (
                    <User className="text-blue-500 size-5 bg-blue-500/30 p-1 rounded-full" /> 
                  )}
                   
                  <div
                    className={`max-w-[650px] p-3 rounded-lg ${
                      message.role === "user"
                        ? `dark:bg-[#42424218] bg-gray-100/50 ${theme.textColor}`
                        : `bg-neutral-100/30 dark:bg-[#ffffff11] ${theme.textColor}`
                    }`}
                  >
                    {/* Show message content OR loading state */}
                    {message.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(message.content.replace(/^html\s*/, ''))
                        }}
                      />
                    ) : (
                      message.role === "assistant" &&
                      isLoading && (
                        <div className="text-gray-500 italic animate-pulse">Thinking...</div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="dark:bg-[#212121c1] h-8 overflow-hidden bg-[#adadadc1] border-[#ffffff1d] flex px-3 items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="dark:text-white/40 text-black/40 text-xs">
              gemini-2.0-flash
            </span>
            <button 
              className={`text-xs flex items-center gap-1 ${
                searchEnabled 
                  ? 'bg-blue-500/20 text-blue-500' 
                  : 'bg-neutral-600/20 text-neutral-600 hover:text-neutral-300 '
              } p-0.5 rounded-full px-2`}
              onClick={toggleSearchMode}
              title={searchEnabled ? "Search mode enabled" : "Search mode disabled"}
            >
              Search <Globe className="size-3"/>
            </button>
            <button className="text-xs flex items-center gap-1 bg-neutral-600/20 text-neutral-600 hover:text-amber-500 hover:bg-amber-500/20 p-0.5 rounded-full px-2">
              Reason <Box className="size-3" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewConversation}
            className="flex gap-1 text-xs items-center dark:text-white/40 text-black/40 hover:text-white/80"
          >
            New
          </button>
          <div className="relative">
            <ConversationSelect
              onSelectConversation={loadConversationFromHistory}
            />
          </div>
          <Link
            href={"/settings"}
            className="hover:text-white/80 dark:text-white/40 text-black/40"
          >
            <Cog size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GeminiChat