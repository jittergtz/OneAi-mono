import SettingsPage from '@/components/Settings'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { BsBack } from 'react-icons/bs'

function page() {
  return (
   <main className='p-5 min-h-screen'>
  <SettingsPage/>


   </main>
  )
}

export default page