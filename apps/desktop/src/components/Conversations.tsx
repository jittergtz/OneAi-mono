"use client"
import * as React from "react"
import { Trash2 } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"


interface Message {
  content: string
  role: string
  id?: string
}

interface Conversation {
  id: number
  timestamp: string
  messages: Message[]
  name?: string // Add optional name field
}

interface ConversationSelectProps {
  onSelectConversation: (id: number | null) => void
}

export function ConversationSelect({
  onSelectConversation,
}: ConversationSelectProps) {
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [open, setOpen] = React.useState(false)

  // Load conversations whenever the component is opened
  React.useEffect(() => {
    if (open) {
      const history = JSON.parse(
        localStorage.getItem("conversationHistory") || "[]"
      )
      setConversations(history)
    }
  }, [open])

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()

    const updatedConversations = conversations.filter((conv) => conv.id !== id)
    localStorage.setItem(
      "conversationHistory",
      JSON.stringify(updatedConversations)
    )
    setConversations(updatedConversations)

    // Also update the current conversation if it was deleted
    const currentMessages = JSON.parse(
      localStorage.getItem("chatMessages") || "[]"
    )
    const currentConversation = conversations.find((conv) => conv.id === id)

    if (
      currentConversation &&
      JSON.stringify(currentMessages) ===
        JSON.stringify(currentConversation.messages)
    ) {
      localStorage.removeItem("chatMessages")
      onSelectConversation(null) // Update the current conversation to null
    }
  }

  // Helper function to get a display name for the conversation
  const getConversationName = (conversation: Conversation) => {
    // If there's a custom name, use it
    if (conversation.name) return conversation.name

    // If there are messages, use the first user message as name
    const firstUserMessage = conversation.messages.find(
      (msg) => msg.role === "user"
    )
    if (firstUserMessage?.content) {
      return (
        firstUserMessage.content.slice(0, 20) +
        (firstUserMessage.content.length > 20 ? "..." : "")
      )
    }

    // Fallback to "New conversation"
    return "New conversation"
  }

  return (
    <Select
      onValueChange={(value) => onSelectConversation(Number(value))}
      onOpenChange={setOpen}
      open={open}
    >
      <SelectTrigger className="w-[180px]  scrollbar-hide  hover:bg-neutral-800 rounded-md  text-xs conversationScroller text-white/40  hover:text-white/70 h-7 border-none border-[#6a6a6a2d]">
        <SelectValue placeholder="Conversations" />
      </SelectTrigger>
      <SelectContent className="bg-[#0d0d0d59]  scrollbar-hide conversationScroller backdrop-blur-lg  overflow-hidden h-64 overflow-y-scroll border-[#c5c2c22d]">
        <SelectGroup >
         
          {conversations.length === 0 ? (
            <div className="py-2 px-2 text-white/50 text-sm">
              No saved conversations
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className="relative flex  scrollbar-hide items-center group hover:bg-neutral-800/40 rounded-sm"
              >
                <SelectItem
                  value={conv.id.toString()}
                  className="flex-grow text-white/70 cursor-pointer"
                >
                  <span className="truncate block">
                    {conv.messages[0]?.content.slice(0, 20) ||
                      "Empty conversation"}
                    ...
                  </span>
                </SelectItem>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="absolute right-0 p-1 rounded-sm bg-red-800/60 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-red-500 hover:text-red-400" />
                </button>
              </div>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
