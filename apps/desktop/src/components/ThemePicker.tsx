"use client"
import React from "react"
import { useTheme } from "../app/ThemeProvider"

function ThemePicker() {
  const { currentTheme, setCurrentTheme } = useTheme();
  
  const themes = [
    {
        name: "System",
        value: "system",
      },
    {
      name: "Light",
      value: "light",
    },
    {
      name: "Dark",
      value: "dark",
    },
    {
      name: "Ocean",
      value: "ocean",
    },
    {
      name: "Glassy",
      value: "glas",
    },
    {
      name: "Red",
      value: "red",
    },
    {
      name: "Carbon",
      value: "carbon",
    },
    {
      name: "Elo",
      value: "elo",
    },
    {
      name: "Sky",
      value: "sky",
    },
    {
      name: "Stone",
      value: "stone",
    },
    {
      name: "Lava",
      value: "lava",
    },
    {
      name: "Prime",
      value: "prime",
    },
    {
      name: "Yacht",
      value: "yacht",
    },

  ]

  const handleTheme = (value: string) => {
    setCurrentTheme(value);
  }

  return (
    <div className="flex select-none px-2 items-center gap-1 p-2 w-full overflow-x-scroll">
      {themes.map((theme) => (
        <button
          onClick={() => handleTheme(theme.value)}
          key={theme.value}
          className={`px-5 text-xs text-[#ffffffb4] h-5 rounded-md border border-[#ffffff30] ${
            theme.value === currentTheme
              ? "bg-neutral-500/70"
              : "bg-neutral-900/50 hover:bg-neutral-500/70"
          }`}
        >
          {theme.name}
        </button>
      ))}
    </div>
  )
}

export default ThemePicker