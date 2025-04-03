"use client"

import { useState } from "react"
import { Github, Link, RotateCcw } from "lucide-react"
import ChatMock from "./ChatDemo"

export default function Details() {
  const [searchQuery, setSearchQuery] = useState("scratch")

  return (
   <div className="min-h-screen flex mt-10 justify-center">
    <div className=" max-w-5xl w-full text-white p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-l from-[#e9eaf3d2] via-[#b1a0a0] to-[#37373e]">Don&apos;t repeat yourself.</h1>
        <p className="text-gray-400">Speed up the things you do all the time.</p>
      </div>

      {/* Snippets Section with Chat */}
      <div className="relative rounded-xl text-sm md:text-xl border bg-gradient-to-tl from-[#242425] from-3% to-black to-40% border-[#1f1f1f69] bg-tansparent p-6 md:h-28 overflow-hidden">
        Open Source AI at your fingertips. One interface, contribute modify make it yours. 
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-b from-[#00000000] to-[#000000a1]"></div>
        <Github className="absolute top-10 text-neutral-700 right-4 w-6 h-6" />
      </div>

   
      
      <div className="flex flex-col gap-6">
      

        {/* Hotkeys Section */}
        <div className="rounded-xl border border-[#2c2c2c3d] bg-neutral-950/20 p-6">
          <div className="flex mt-12 justify-center mb-6">
            <div className="flex  w-full justify-center items-center gap-2">
              <div className="bg-zinc-900  rounded-md h-16 p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-mono">⌥</span>
                <span className="text-sm ">option</span>
              </div>
              <div className="bg-zinc-900 animate-pulse  max-w-96 w-full h-16 rounded-md p-3  flex flex-col items-center justify-center">
                <span className="text-lg font-mono ">space</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-lg text-transparent bg-clip-text bg-gradient-to-l from-[#e4e5f1d2]  to-[#78797da1] font-medium">
              Open One in a Sec
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-300">
            Use the global hotkey<code className="bg-zinc-800 rounded-md p-1 text-xs">⌥ space</code> to open One from anywhere.
          </p>
        </div>
        <h1 className="text-2xl mt-20 font-semibold text-transparent bg-clip-text bg-gradient-to-l from-[#e9eaf3d2] via-[#b1a0a0] to-[#74626c]">Try it locally Today.</h1>
        <ChatMock />
      </div>
        
     <div className="flex justify-center text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#91838acd] from-30% to-[#171717af] to-70% mb-5 mt-40">
        <h1>One Ai</h1>
     </div>
    </div>
    </div>
  )
}

