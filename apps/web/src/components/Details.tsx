"use client"

import { useState } from "react"
import { Link, RotateCcw } from "lucide-react"

export default function Details() {
  const [searchQuery, setSearchQuery] = useState("scratch")

  return (
    <div className="min-h-screen  text-white p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-[#e9eaf3]">Don&apos;t repeat yourself.</h1>
        <p className="text-gray-400">Automate the things you do all the time.</p>
      </div>

      {/* Snippets Section with Chat */}
      <div className="relative rounded-xl border border-[#ffffff3d] bg-neutral-950 p-6 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <h2 className="text-lg font-medium">Snippets</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-400 max-w-md">
          Tired of typing the same thing? Create a snippet and insert it by simply typing its keyword.
        </p>

        {/* Chat Interface */}
        <div className="absolute right-0 top-0 bottom-0 w-2/3 overflow-hidden">
          {/* Blue gradient background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-blue-600/10 to-blue-500/30 transform rotate-12 scale-150 translate-x-1/4"></div>

          {/* Chat box */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2  rounded-lg p-4 w-[400px] backdrop-blur-sm">
            <p className="text-gray-300 mb-3">Sure, here you go:</p>
            <p className="text-cyan-400 mb-4">3rd Floor 1 Ashley Road, WA14 2DT Altrincham, Cheshire</p>
            <div className="flex justify-between">
              <button className="p-2 rounded-full bg-zinc-700/80">
                <RotateCcw size={18} className="text-gray-300" />
              </button>
              <button className="px-4 py-2 bg-zinc-200 text-black font-medium rounded-md">Send</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
        {/* Quicklinks Section */}
        <div className="rounded-xl border border-[#ffffff3d] bg-neutral-950 p-6">
          {/* Search Interface */}
          <div className="mb-6">
            <div className="bg-zinc-800 rounded-md p-3 mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full"
                />
                <span className="text-gray-500">|</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-2">Results</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded">
                <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-pink-500 to-blue-500 rounded">
                  <span className="text-xs text-white">F</span>
                </div>
                <span className="text-white">Figma Scratchpad</span>
                <span className="text-gray-500 text-xs ml-auto">figma.com</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded">
                <div className="w-5 h-5 flex items-center justify-center bg-zinc-700 rounded">
                  <span className="text-xs text-white">F</span>
                </div>
                <span className="text-white">Framer Scratchpad</span>
                <span className="text-gray-500 text-xs ml-auto">framer.com</span>
              </div>
            </div>
          </div>

          {/* Quicklinks */}
          <div className="flex items-center gap-2 mt-6">
            <Link className="h-5 w-5 text-white" />
            <h2 className="text-lg font-medium">Quicklinks</h2>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Say goodbye to open tabs. Create quicklinks to launch anything from anywhere.
          </p>
        </div>

        {/* Hotkeys Section */}
        <div className="rounded-xl border border-[#ffffff3d] bg-neutral-950 p-6">
          <div className="flex mt-12 justify-center mb-6">
            <div className="flex justify- items-center gap-2">
              <div className="bg-zinc-800 rounded-md h-16 p-3 flex flex-col items-center justify-center">
                <span className="text-lg font-mono">⌥</span>
                <span className="text-sm ">option</span>
              </div>
              <div className="bg-zinc-800 w-80 h-16 rounded-md p-3  flex flex-col items-center justify-center">
                <span className="text-lg font-mono ">space</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Open One</h2>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Use the global hotkey <code className="bg-zinc-800 rounded-md p-1 text-xs">⌥ space</code> to open One from anywhere.
          </p>
        </div>
      </div>
    </div>
  )
}

