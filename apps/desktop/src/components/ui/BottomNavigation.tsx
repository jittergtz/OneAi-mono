import Link from 'next/link'
import React from 'react'
import { ConversationSelect } from '../Conversations'
import { Box, Cog, Globe } from 'lucide-react'

interface BottomNavigationProps {
  searchEnabled: boolean;
  toggleSearchMode: () => void;
  handleNewConversation: () => void;
  loadConversationFromHistory: (id: number | null) => void;
}

function BottomNavigation( { searchEnabled, toggleSearchMode, handleNewConversation, loadConversationFromHistory }: BottomNavigationProps 
 ) {
  return (
    <div className="bg-[#212121c1] h-8 overflow-hidden  border-[#ffffff1d] flex px-3 items-center justify-between gap-5">
<div>
  <div className="flex items-center gap-2">
    <span className="text-white/40  text-xs">
      gemini-2.0-flash
    </span>
    <button
      className={`text-xs flex items-center gap-1 ${
        searchEnabled
          ? "bg-blue-500/20 text-blue-500"
          : "bg-neutral-600/20 text-neutral-600 hover:text-neutral-300 "
      } p-0.5 rounded-full px-2`}
      onClick={toggleSearchMode}
      title={
        searchEnabled ? "Search mode enabled" : "Search mode disabled"
      }
    >
      Search <Globe className="size-3" />
    </button>
    <button className="text-xs flex items-center gap-1 bg-neutral-600/20 text-neutral-600 hover:text-amber-500 hover:bg-amber-500/20 p-0.5 rounded-full px-2">
      Reason <Box className="size-3" strokeWidth={1.75} />
    </button>
  </div>
</div>
<div className="flex items-center gap-2">
  <button
    onClick={handleNewConversation}
    className="flex gap-1 text-xs items-center text-white/40  hover:text-white/80"
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
    className="hover:text-white/80 text-white/40 "
  >
    <Cog size={14} />
  </Link>
</div>
</div>
  )
}

export default BottomNavigation