"use client"

import { useTheme } from "@/app/ThemeProvider"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ConversationSelect } from "./Conversations"
import DOMPurify from "dompurify"
import { TextShimmer } from "../../components/motion-primitives/text-shimmer"
import ReactMarkdown from "react-markdown"
import { toast, Toaster } from "sonner"
import { NotifyReason, NotifySearch } from "./ui/Notify"
import { Box, Cog, Globe, Send, Sparkles, User } from "lucide-react"
import MessageContainer from "./ui/MessageContainer"
import BottomNavigation from "./ui/BottomNavigation"

// Message type definition
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    title: string
    url: string
  }>
  groundingSearchEntryPoint?: string
}

// Conversation type definition
type Conversation = {
  id: number
  timestamp: string
  messages: Message[]  // Fixed: Changed from Message to Message[]
  name?: string
}

function Chat() {
  // State management
  const [messages, setMessages] = useState<Message[]>(() => {  // Fixed: Changed from Message to Message[]
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages")
      return savedMessages ? JSON.parse(savedMessages) : [];  // Fixed: Added empty array
    }
    return [];  // Fixed: Added empty array for server-side rendering
  })
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null)
  const [conversations, setConversations] = useState<Conversation[]>(() => {  // Fixed: Changed from Conversation to Conversation[]
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("conversationHistory")
      return saved ? JSON.parse(saved) : [];  // Fixed: Added empty array
    }
    return [];  // Fixed: Added empty array for server-side rendering
  })
  const [searchEnabled, setSearchEnabled] = useState(false)

  // Handle toggle search mode
  const toggleSearchMode = () => {
    const newSearchState = !searchEnabled
    setSearchEnabled(newSearchState)

    toast.custom((t) => (
      <div className="-mt-[9px] pointer-events-none   items-center w-[170px] ml-[520px] flex justify-end">
        <NotifySearch searchState={newSearchState} />
      </div>
    ))
  }

  // Save changes to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
      if (currentConversationId !== null) {
        const conversationHistory = JSON.parse(
          localStorage.getItem("conversationHistory") || "[]"  // Fixed: Added default empty array
        )
        const updatedHistory = conversationHistory.map((conv: Conversation) => {
          if (conv.id === currentConversationId) {
            return { ...conv, messages }
          }
          return conv
        })
        localStorage.setItem(
          "conversationHistory",
          JSON.stringify(updatedHistory)
        )
      }
    }
  }, [messages, currentConversationId])

  // Handle new conversation
  const handleNewConversation = () => {
    if (messages.length > 0) {
      const conversationHistory = JSON.parse(
        localStorage.getItem("conversationHistory") || "[]"  // Fixed: Added default empty array
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
    setMessages([]);  // Fixed: Set to empty array
    setCurrentConversationId(null);
    localStorage.removeItem("chatMessages");
    const updatedHistory = JSON.parse(
      localStorage.getItem("conversationHistory") || "[]"  // Fixed: Added default empty array
    );
    setConversations(updatedHistory);
  }

  // Load conversation from history
  const loadConversationFromHistory = (id: number | null) => {
    if (id === null) {
      setMessages([]);  // Fixed: Set to empty array
      setCurrentConversationId(null);
      localStorage.removeItem("chatMessages");
      return;
    }
    const history = JSON.parse(
      localStorage.getItem("conversationHistory") || "[]"  // Fixed: Added default empty array
    );
    const conversation = history.find((conv: Conversation) => conv.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(id);
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(conversation.messages)
      );
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message function with search flag support
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

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
        localStorage.getItem("conversationHistory") || "[]"  // Fixed: Added default empty array
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
            try {
              const parsedContent = JSON.parse(newContent)
              if (parsedContent.sources) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          content: parsedContent.text || "",
                          sources: parsedContent.sources || [],  // Fixed: Added empty array
                          groundingSearchEntryPoint:
                            parsedContent.groundingMetadata?.searchEntryPoint
                              ?.renderedContent, // Extract renderedContent
                        }
                      : msg
                  )
                )
              } else {
                fullResponse = xhr.responseText
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + newContent }
                      : msg
                  )
                )
              }
            } catch {
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
        useSearch: searchEnabled,
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

  const cleanHtml = (html: string) => {
    return DOMPurify.sanitize(
      html
        .replace(/^```html/, "")
        .replace(/```$/, "")
        .trim() // Removes ```html and ```
    )
  }

  return (
    <div className="w-full to-transparent mx-auto">
      <Toaster position="top-left" />
      <div className="relative">
        <div className={`fixed border-b p-1 top-0 w-full ${theme.borderColor}`}>
          <form autoFocus onSubmit={handleSubmit} className="flex w-full gap-2">
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-[#ffffffe5] placeholder:text-[#d9e1ea94] outline-none border-neutral-500 p-2"
            />
            <button
              disabled={isLoading}
              className="hover:bg-neutral-900/70  p-3 rounded-md text-white/40 "
              type="submit"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        <div className="space-y-4 mt-12 w-full h-[390px] overflow-y-scroll p-2 pt-2">
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
                <div
                  className={`flex gap-2 ${
                    message.role === "user" ? "items-center" : "items-start"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="text-orange-600 size-5 bg-red-500/20 p-1 rounded-md" />
                  ) : (
                    <User className="text-blue-500 size-5 bg-blue-500/30 p-1 rounded-full" />
                  )}

                  <div
                    className={`max-w-[650px] p-3 rounded-lg ${
                      message.role === "user"
                        ? `bg-[#42424218]  ${theme.textColor}`
                        : `bg-[#42424218] ${theme.textColor}`
                    }`}
                  >
                
               
                    {/* Show message content OR loading state */}
                    <MessageContainer
                      message={message}
                      isLoading={isLoading}
                    />
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold">Sources:</p>
                        <ul>
                          {message.sources.map((source, index) => (
                            <li key={index} className="list-disc ml-5">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <BottomNavigation
        searchEnabled={searchEnabled}
        toggleSearchMode={toggleSearchMode}
        handleNewConversation={handleNewConversation}
        loadConversationFromHistory={loadConversationFromHistory}
      />
    </div>
  )
}

export default Chat