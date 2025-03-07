"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Folder, Github, Terminal } from "lucide-react"

export default function MacOSDock() {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null)

  const dockItems = [
    { name: "Finder", icon: <Folder className="w-full text-white/60 h-full" /> },
    { name: "GitHub", icon: <Github className="w-full text-white/60 h-full" /> },
    {
      name: "VSCode",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#007ACC"
            d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
          />
        </svg>
      ),
    },
    { name: "Terminal", icon: <Terminal className="w-full text-white/60 h-full" /> },
  ]

  return (
    <div className="flex items-end justify-center w-full absolute bottom-0">
      <motion.div
        className="flex items-end gap-3 p-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg mb-2"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {dockItems.map((item, index) => (
          <motion.div
            key={item.name}
            className="flex flex-col items-center group"
            onMouseEnter={() => setHoveredIcon(index)}
            onMouseLeave={() => setHoveredIcon(null)}
            initial={{ y: 0 }}
            animate={{
              y: hoveredIcon === index ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="relative"
              animate={{
                scale: hoveredIcon === index ? 1.5 : hoveredIcon === index - 1 || hoveredIcon === index + 1 ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center p-2 shadow-lg overflow-hidden">
                {item.icon}
              </div>

              {/* Reflection effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white/10 backdrop-blur-sm rounded-b-xl" />
            </motion.div>

            {/* App name tooltip */}
            <motion.div
              className="absolute -top-8 px-2 py-1 bg-black/75 text-white/70 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: hoveredIcon === index ? 1 : 0,
                y: hoveredIcon === index ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

