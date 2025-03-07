import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="w-full mt-20  text-white py-10">
<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
  <div className="mb-6 md:mb-0">
    <h2 className="text-2xl text-center sm:text-start font-bold">One</h2>
    <p className="text-sm text-gray-400">
      The all-in-one AI shortcut for your Mac
    </p>
  </div>
  <div className="flex space-x-6">
    <Link href="/about" className="text-gray-400 hover:text-white">
      About
    </Link>
    <Link href="/features" className="text-gray-400 hover:text-white">
      Features
    </Link>
    <Link href="/pricing" className="text-gray-400 hover:text-white">
      Open source
    </Link>
    <Link href="/contact" className="text-gray-400 hover:text-white">
      Contact
    </Link>
  </div>
  <div className="mt-6 md:mt-0">
    <p className="text-sm text-gray-400">
      &copy; 2025 One. All rights reserved.
    </p>
  </div>
</div>
</footer>
  )
}

export default Footer