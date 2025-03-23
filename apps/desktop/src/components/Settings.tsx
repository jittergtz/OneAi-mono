"use client"
import { Box, ChevronLeft as ChevronLeftIcon, Globe } from 'lucide-react'
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
    <Link className={`fixed hover:text-current/40  top-4 left-4 ${theme.textColor}`} href="/"><ChevronLeftIcon size={17} /></Link>
    <h1 className={`text-xl select-none  mt-6 ${theme.textColor} `}>Settings</h1>

    <div className='p-1 mt-2 rounded-md bg-black/20'>
    <form className="mt-2" onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className='flex gap-3'>
      <label htmlFor="apiKey" className="block  ml-1 text-white/40 text-sm font-medium mb-2">
      My API Key
      </label>

      </div>
      <div className='flex items-center gap-1'>
      <input
        type="password"
        id="apiKey"
        name="apiKey"
        className="w-full p-2 placeholder:text-[#ffffff8e] outline-none text-[#c4bcbccb] font-bold  border border-[#35343468] bg-[#1f1f1f68] rounded-md"
        placeholder="Enter your Gemini API key"
        value={apiKey}
        onChange={handleInputChange}
      />

      <button
      type="submit"
      className="border select-none border-[#35343468] bg-[#1f1f1f68] cursor-pointer  p-2 text-[#ffffff8b] px-4 rounded-lg hover:bg-[#151516d1]"
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
      <label htmlFor="theme" className="block select-none ml-1 text-white/40 text-sm font-medium mb-2">
     Themes
      </label>
      <div className='flex items-center gap-1'>
    

     <ThemePicker/>
      </div>
      </div>
    </div>

    <div className='p-1 mt-2 flex flex-col gap-2 rounded-md bg-black/10'>
    <label htmlFor="apiKey" className="block   ml-1 text-white/40 text-sm font-medium mb-2">
     Important
    </label>
    
    <div className='flex gap-2'>
      <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-1 h-5 p-1 justify-center text-blue-500  rounded-full text-[10px] bg-blue-800/70'> Search <Globe className="size-3"/></div>
      <div className='flex items-center gap-1 h-5 p-1 justify-center text-amber-500  rounded-full text-[10px] bg-amber-800/70'> Reason <Box className="size-3" strokeWidth={1.75} /> </div>
      </div>
     <p className='tracking-wide  px-1 text-white/60 text-xs'>
      Live Search and Reason are only available with a pay-as-you-go API KEY from the Gemini API. 
     <br /> You can upgrade to it here: <a
  href="https://aistudio.google.com/plan_information"
  onClick={(e) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).require) {
      // This will open the URL in the default browser
      const { shell } = (window as any).require("electron");
      shell.openExternal("https://aistudio.google.com/plan_information");
    } else {
      window.open("https://aistudio.google.com/plan_information", "_blank");
    }
  }}
  className="text-blue-500 text-xs px-1 bg-blue-950/80 hover:bg-blue-200/20 rounded-sm"
>
  upgrade
</a> or under: <span className='underline'>https://aistudio.google.com/plan_information</span></p>
  </div>
  </div>

   
    <div className='p-1 mt-2 rounded-md bg-black/10'>
    <label htmlFor="apiKey" className="block  ml-1 text-white/40 text-sm font-medium mb-2">
     Informations
    </label>
 
     <p className='tracking-wide px-1 text-white/40 text-xs'>
      One is a cryptocurrency exchange and custodian that allows customers to buy, sell, and store digital assets. The company was founded in 2014 by Cameron and Tyler Winklevoss. Gemini is a New York trust company that is regulated by the New York State Department of Financial Services (NYDFS). Gemini is a fiduciary and subject to the capital reserve requirements, cybersecurity requirements, and banking compliance standards set forth by the NYDFS and the New York Banking Law. Gemini was the world's first licensed ether exchange.
     </p>
      </div>

   </main>
  )
}

export default SettingsPage