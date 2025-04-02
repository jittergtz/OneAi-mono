// electron.d.ts
declare global {
  interface Window {
    electron: {
      navigate: (path: string) => Promise<{ success: boolean; error?: string }>;
      ipcRenderer: {
        send: (channel: string, data: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        invoke: (channel: string, data?: any) => Promise<any>;
      };
    };
  }
}

// This export is needed to make TypeScript treat this as a module
export {};