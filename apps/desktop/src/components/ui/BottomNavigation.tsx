import Link from 'next/link'
import React, { ReactNode, useEffect, useState } from 'react'
import { ConversationSelect } from '../Conversations'
import { Box, Cog, Globe } from 'lucide-react'

declare global {
  interface Window {
    electron: {
      navigate: (path: string) => Promise<{success: boolean, error?: string}>;
      ipcRenderer: {
        send: (channel: string, data: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        invoke: (channel: string, data?: any) => Promise<any>;
      };
    };
  }
}

interface BottomNavigationProps {
  searchEnabled: boolean;
  toggleSearchMode: () => void;
  handleNewConversation: () => void;
  loadConversationFromHistory: (id: number | null) => void;
  settingsHref: string;
}

function BottomNavigation({ 
  searchEnabled, 
  toggleSearchMode, 
  handleNewConversation, 
  loadConversationFromHistory, 
  settingsHref 
}: BottomNavigationProps) {
  // Check if we're in development mode
  const [isDev, setIsDev] = useState(false);
  
  useEffect(() => {
    // In development, we'll have a dev server running on a specific port
    // Production builds will have the app:// protocol or file:// protocol
    const isDevServer = window.location.protocol === 'http:' || 
                        window.location.protocol === 'https:';
    setIsDev(isDevServer);
  }, []);

  const handleNavigate = async (e: React.MouseEvent, path: string) => {
    if (isDev) {
      // Let Next.js handle routing in dev mode
      return true;
    } else {
      // Use Electron navigation in production mode
      e.preventDefault();
      if (window.electron) {
        try {
          await window.electron.navigate(path);
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback
          window.location.href = path;
        }
      }
    }
  }

  return (
    <div className="bg-[#212121c1] select-none h-8 overflow-hidden border-[#ffffff1d] flex px-3 items-center justify-between gap-5">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">
            gemini-2.0-flash
          </span>
          <button
            className={`text-xs flex items-center gap-1 ${
              searchEnabled
                ? "bg-blue-500/20 text-blue-500"
                : "bg-neutral-700 text-neutral-500 hover:text-neutral-300 "
            } p-0.5 rounded-full px-2`}
            onClick={toggleSearchMode}
            title={
              searchEnabled ? "Search mode enabled" : "Search mode disabled"
            }
          >
            Search <Globe className="size-3" />
          </button>
          <button className="text-xs flex items-center gap-1 bg-neutral-700 text-neutral-500 hover:text-amber-500 hover:bg-amber-500/20 p-0.5 rounded-full px-2">
            Reason <Box className="size-3" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleNewConversation}
          className="flex gap-1 text-xs items-center text-white/40 hover:text-white/80"
        >
          New Chat
        </button>
        <div className="relative">
          <ConversationSelect
            onSelectConversation={loadConversationFromHistory}
          />
        </div>
   
        <Link 
          href={settingsHref} 
          onClick={(e) => handleNavigate(e, settingsHref)}
          className="hover:text-white/80 text-white/40"
          draggable={false}
        >
          <Cog size={14} />
        </Link>
      </div>
    </div>
  )
}

export default BottomNavigation