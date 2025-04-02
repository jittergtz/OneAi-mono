// components/ElectronLink.tsx
import { MouseEvent, ReactNode } from 'react';

interface ElectronLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const ElectronLink = ({ href, children, className }: ElectronLinkProps) => {
  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Check if we're in Electron environment
    if (window.electron) {
      await window.electron.ipcRenderer.invoke('navigate', href);
    } else {
      // Fallback for dev mode
      window.location.href = href;
    }
  };

  return (
    <a 
     href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default ElectronLink;