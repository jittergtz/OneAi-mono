// src/preload/index.ts (Standard electron-vite location)

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Whitelist channels
const ipcChannels = {
  invoke: ['get-api-key', 'save-api-key', 'gemini-api-request', 'navigate'], // Add navigate if you still need it
  on: ['gemini-stream-chunk', 'gemini-stream-complete', 'gemini-stream-error'], // Allow listening to these
  // 'send' is generally less needed when using invoke/handle and 'on'
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    // Use invoke for request/response communication
    invoke: (channel: string, ...args: any[]) => {
      if (ipcChannels.invoke.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      console.warn(`Blocked invoke to channel: ${channel}`);
      return Promise.reject(new Error(`Blocked invoke to channel: ${channel}`));
    },
    // Use 'on' for receiving messages from main (like stream chunks)
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
      // Construct the channel prefix for stream events dynamically
      const channelPrefix = channel.substring(0, channel.lastIndexOf('-') + 1); // e.g., "gemini-stream-12345-"
      const eventType = channel.substring(channel.lastIndexOf('-') + 1); // e.g., "chunk", "complete", "error"

      // Check if the event type is whitelisted for dynamic stream channels
      if (channel.startsWith('gemini-stream-') && ipcChannels.on.includes(`gemini-stream-${eventType}`)) {
         ipcRenderer.on(channel, listener);
         // Return an unsubscribe function
         return () => {
             ipcRenderer.removeListener(channel, listener);
         };
      } else if (ipcChannels.on.includes(channel)) { // For non-dynamic channels if any
          ipcRenderer.on(channel, listener);
          // Return an unsubscribe function
          return () => {
              ipcRenderer.removeListener(channel, listener);
          };
      }

      console.warn(`Blocked listener registration for channel: ${channel}`);
      // Return a dummy unsubscribe function for blocked channels
      return () => {};
    },
     // You might not need 'send' if using invoke/handle
    // send: (channel: string, ...args: any[]) => {
    //   if (ipcChannels.send.includes(channel)) {
    //     ipcRenderer.send(channel, ...args);
    //   } else {
    //      console.warn(`Blocked send to channel: ${channel}`);
    //   }
    // },
     removeAllListeners: (channel: string) => {
        // Also check whitelist for dynamic channels
        const channelPrefix = channel.substring(0, channel.lastIndexOf('-') + 1);
        const eventType = channel.substring(channel.lastIndexOf('-') + 1);

        if (channel.startsWith('gemini-stream-') && ipcChannels.on.includes(`gemini-stream-${eventType}`)) {
            ipcRenderer.removeAllListeners(channel);
        } else if (ipcChannels.on.includes(channel)) {
             ipcRenderer.removeAllListeners(channel);
        } else {
            console.warn(`Blocked removeAllListeners for channel: ${channel}`);
        }

    }
  },
  // Keep navigate if you use it, ensure 'navigate' is in ipcChannels.invoke
  navigate: (path: string) => {
      if (ipcChannels.invoke.includes('navigate')) {
         return ipcRenderer.invoke('navigate', path);
      }
      console.warn(`Blocked navigate call`);
      return Promise.reject(new Error(`Blocked navigate call`));
  }
});

// Optional: Add types for the exposed API
declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                invoke(channel: string, ...args: any[]): Promise<any>;
                on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): () => void; // Return unsubscribe fn
                // send?(channel: string, ...args: any[]): void;
                removeAllListeners(channel: string): void;
            };
            navigate?(path: string): Promise<any>;
        }
    }
}