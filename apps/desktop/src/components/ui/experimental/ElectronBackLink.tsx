"use client"
import Link from 'next/link'
import React, { useState, useEffect, MouseEvent } from 'react'
import { ChevronLeft } from 'lucide-react'

interface ElectronBackLinkProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

const ElectronBackLink: React.FC<ElectronBackLinkProps> = ({ 
  href, 
  className = '', 
  children = <ChevronLeft size={17} />
}) => {
  const [isDev, setIsDev] = useState(false);
  
  useEffect(() => {
    // In development, we'll have a dev server running on a specific port
    // Production builds will have the app:// protocol or file:// protocol
    const isDevServer = window.location.protocol === 'http:' || 
                        window.location.protocol === 'https:';
    setIsDev(isDevServer);
  }, []);

  const handleNavigate = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (isDev) {
      // Let Next.js handle routing in dev mode
      return true;
    } else {
      // Use Electron navigation in production mode
      e.preventDefault();
      if (window.electron) {
        try {
          await window.electron.navigate(href);
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback
          window.location.href = href;
        }
      }
    }
  }

  return (
    <Link 
      className={className} 
      href={href} 
      onClick={handleNavigate}
    >
      {children}
    </Link>
  );
};

export default ElectronBackLink;