// utils/geminiApi.ts
import { ReadableStream } from 'stream/web';

export async function* streamGeminiResponse(requestData: any) {
  if (typeof window !== 'undefined' && window.electron) {
    // We're in Electron
    const response = await window.electron.ipcRenderer.invoke('gemini-api-request', requestData);
    
    if (!response.success) {
      throw new Error(response.error || 'API request failed');
    }
    
    // Create a new ReadableStream that bridges IPC communication
    const { streamChannelId } = response;
    
    let resolveChunk: (value: string | null) => void;
    let rejectChunk: (reason: Error) => void;
    
    // Set up listeners for stream chunks
    const chunkListener = (event: any, chunk: string) => {
      resolveChunk(chunk);
    };
    
    const completeListener = () => {
      // Stream is complete
      resolveChunk(null);
      // Clean up listeners
      window.electron.ipcRenderer.removeListener(`${streamChannelId}-chunk`, chunkListener);
      window.electron.ipcRenderer.removeListener(`${streamChannelId}-complete`, completeListener);
      window.electron.ipcRenderer.removeListener(`${streamChannelId}-error`, errorListener);
    };
    
    const errorListener = (event: any, errorMessage: string) => {
      rejectChunk(new Error(errorMessage));
      // Clean up listeners
      window.electron.ipcRenderer.removeListener(`${streamChannelId}-chunk`, chunkListener);
      window.electron.ipcRenderer.removeListener(`${streamChannelId}-complete`, completeListener);
      window.electron.ipcRenderer.removeListener(`${streamChannelId}-error`, errorListener);
    };
    
    // Register listeners
    window.electron.ipcRenderer.on(`${streamChannelId}-chunk`, chunkListener);
    window.electron.ipcRenderer.on(`${streamChannelId}-complete`, completeListener);
    window.electron.ipcRenderer.on(`${streamChannelId}-error`, errorListener);
    
    // Yield chunks as they arrive
    while (true) {
      const chunkPromise = new Promise<string | null>((resolve, reject) => {
        resolveChunk = resolve;
        rejectChunk = reject;
      });
      
      const chunk = await chunkPromise;
      if (chunk === null) {
        // End of stream
        break;
      }
      
      yield chunk;
    }
  } else {
    // We're in Next.js development
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield chunk;
    }
  }
}