import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server";
import path, { join } from "path";
import * as fsPromises from 'fs/promises';

let mainWindow: BrowserWindow | null = null;

// Function to get the API key file path in userData directory
const getApiKeyFilePath = () => {
  return path.join(app.getPath('userData'), 'api-key.txt');
};


const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    width: 750,
    height: 470,
    frame: false,
    vibrancy: "under-window",
    resizable: false,
    icon: path.join(__dirname, '..', '..', 'public', process.platform === 'darwin' ? 'one-logo.icns' : 'one-logo.ico'),
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

// Damit das Fenster auf allen Spaces, auch im Vollbildmodus, angezeigt wird:
mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

// Setze AlwaysOnTop mit einem höheren Level:
mainWindow.setAlwaysOnTop(true, "screen-saver", 1);

  mainWindow.on("ready-to-show", () => mainWindow?.show());

  if (is.dev) {
    mainWindow
      .loadURL("http://localhost:3000")
      .catch((error) => console.error("Error loading dev URL:", error));
  } else {
    try {
      const port = await startNextJSServer();
      console.log("Next.js server started on port:", port);
      mainWindow
        .loadURL(`http://localhost:${port}`)
        .catch((error) =>
          console.error("Error loading production URL:", error)
        );
    } catch (error) {
      console.error("Error starting Next.js server:", error);
    }
  }
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: "localhost",
      port: nextJSPort,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("ping", () => console.log("pong"));

  globalShortcut.register("Option+Space", () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.center();
      mainWindow?.show();
      mainWindow?.focus();
    }
  });

  // --- IPC Handlers ---

  // Handle saving the API Key
  ipcMain.handle('save-api-key', async (event, apiKey: string) => {
    const filePath = getApiKeyFilePath();
    try {
      await fsPromises.writeFile(filePath, apiKey, { encoding: 'utf-8' });
      return { success: true };
    } catch (error: any) {
      console.error('Error saving API Key to file:', error);
      return { success: false, error: error.message };
    }
  });

  // Handle loading the API Key
  ipcMain.handle('get-api-key', async (event) => { // New handler for getting API key
    const filePath = getApiKeyFilePath();
    try {
      const apiKey = await fsPromises.readFile(filePath, { encoding: 'utf-8' }); // Read API key from file
      return { apiKey }; // Return the API key in the response
    } catch (error: any) {
      // If file doesn't exist or other errors, return null or handle as needed
      console.warn('Error reading API Key file (may not exist yet):', error.message);
      return { apiKey: null }; // Return null if API key cannot be read (or file not found)
    }
  });

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});