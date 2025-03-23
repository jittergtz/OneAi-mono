import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { getPort } from "get-port-please";
import path, { join } from "path";
import * as fsPromises from 'fs/promises';
import { fork } from 'child_process';

let mainWindow: BrowserWindow | null = null;
let nextApp: any = null;

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
      
      // Kurze Verzögerung, um dem Server Zeit zum Starten zu geben
      await new Promise(resolve => setTimeout(resolve));
      
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
    const nextJSPort = await getPort({ portRange: [3001, 5000] });
    const appDir = join(app.getAppPath(), "app");

    console.log("App directory:", appDir);

    // Use the full path to the Next.js binary
    const nextBinary = join(appDir, 'node_modules', '.bin', 'next');

    // Start the Next.js server using the Next.js CLI
    nextApp = fork(nextBinary, ['start', '-p', nextJSPort.toString()], {
      cwd: appDir,
      env: { ...process.env, PORT: nextJSPort.toString() }
    });

    // Log any output from the server
    nextApp.stdout?.on('data', (data: Buffer) => console.log(`Next.js: ${data.toString()}`));
    nextApp.stderr?.on('data', (data: Buffer) => console.error(`Next.js Error: ${data.toString()}`));

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
  ipcMain.handle('get-api-key', async (event) => {
    const filePath = getApiKeyFilePath();
    try {
      const apiKey = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      return { apiKey };
    } catch (error: any) {
      console.warn('Error reading API Key file (may not exist yet):', error.message);
      return { apiKey: null };
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
  if (nextApp) {
    console.log("Killing Next.js server");
    nextApp.kill();
  }
  globalShortcut.unregisterAll();
});