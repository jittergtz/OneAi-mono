"use client"
import { ChevronLeft as ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react' // Import useEffect
import { ChevronLeft } from 'lucide-react'
import ThemePicker from './ThemePicker'
import { useTheme } from '@/app/ThemeProvider'

function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
   const { theme } = useTheme();

  useEffect(() => {
    // Load API key when component mounts
    const loadApiKey = async () => {
      try {
        const apiKeyResult = await window.electron.ipcRenderer.invoke('get-api-key');
        if (apiKeyResult && apiKeyResult.apiKey) {
          setApiKey(apiKeyResult.apiKey); // Set API key state with loaded value
        }
      } catch (error) {
        console.error('Error loading API Key:', error);
        setSaveStatus('Error loading API Key.'); // Optionally set an error message
      }
    };

    loadApiKey(); // Call the loadApiKey function when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once on mount


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const result = await window.electron.ipcRenderer.invoke('save-api-key', apiKey);
      if (result && result.success) {
        setSaveStatus('API Key saved successfully!');
      } else {
        setSaveStatus('Failed to save API Key.');
      }
    } catch (error: any) {
      console.error('Error saving API Key:', error);
      setSaveStatus(`Error saving API Key: ${error.message}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
    setSaveStatus(null);
  };


  return (
   <main className='p-5 min-h-screen'>
    <Link className='absolute text-white/70 hover:text-white top-4 left-4' href="/"><ChevronLeftIcon size={17} /></Link>
    <h1 className={`text-xl mt-6 ${theme.textColor} `}>Settings</h1>

    <div className='p-1 mt-2 rounded-md bg-black/20'>
    <form className="mt-2" onSubmit={handleSubmit}>
      <div className="mb-4">
      <label htmlFor="apiKey" className="block  ml-1 text-white/40 text-sm font-medium mb-2">
      My API Key
      </label>
      <div className='flex items-center gap-1'>
      <input
        type="password"
        id="apiKey"
        name="apiKey"
        className="w-full p-2 placeholder:text-[#ffffff8e] outline-none text-[#9090908e]  border border-[#404040] rounded-md"
        placeholder="Enter your Gemini API key"
        value={apiKey}
        onChange={handleInputChange}
      />

      <button
      type="submit"
      className="bg-[#5a5acefa] cursor-pointer  p-2 text-[#ffffff8b] px-4 rounded-md hover:bg-[#5a5aced1]"
      >
      Save
      </button>
      </div>
      </div>
    </form>
      {saveStatus && (
        <div className="mt-4 text-sm text-white/70">
          {saveStatus}
        </div>
      )}
    </div>
 
    <div className='p-1 mt-2 rounded-md bg-black/20'>

      <div className="mb-4">
      <label htmlFor="apiKey" className="block  ml-1 text-white/40 text-sm font-medium mb-2">
     Themes
      </label>
      <div className='flex items-center gap-1'>
    

     <ThemePicker/>
      </div>
      </div>
    </div>

   </main>
  )
}

export default SettingsPage