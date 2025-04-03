import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  },
  // Navigation function
  navigate: (path: string) => ipcRenderer.invoke('navigate', path),

});