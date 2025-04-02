import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, globalShortcut, nativeImage } from "electron";
import path, { join } from "path";
import * as fsPromises from 'fs/promises';

app.whenReady().then(() => {
  if (process.platform === "darwin") {
    const iconPath = path.join(__dirname, "..", "..", "public", "one-logo.icns");
    const appIcon = nativeImage.createFromPath(iconPath);
    app.dock.setIcon(appIcon);
  }
});

let mainWindow: BrowserWindow | null = null;

// Function to get the API key file path in userData directory
const getApiKeyFilePath = () => path.join(app.getPath('userData'), 'api-key.txt');

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

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
  mainWindow.on("ready-to-show", () => mainWindow?.show());

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  // 🌟 FIX: Use `app.isPackaged` to detect production mode correctly
  const isProduction = app.isPackaged;

  if (!isProduction) {
    console.log("🚀 Running in DEV mode");
    mainWindow.loadURL("http://localhost:3000").catch((error) =>
      console.error("Error loading dev URL:", error)
    );
  } else {
    console.log("📦 Running in PRODUCTION mode");
    // This is the crucial fix - the path needs to point to the correct location
    const indexPath = path.join(__dirname, "..", "out", "index.html");
    console.log("Loading from path:", indexPath);
    mainWindow.loadFile(indexPath).catch((error) =>
      console.error("Error loading production file:", error)
    );
  }

  // 🌟 FIX: Remove `will-navigate` to allow proper routing in Next.js
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("✅ Next.js App Loaded Successfully");
  });
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

  ipcMain.handle('save-api-key', async (event, apiKey: string) => {
    const filePath = getApiKeyFilePath();
    try {
      await fsPromises.writeFile(filePath, apiKey, { encoding: 'utf-8' });
      return { success: true };
    } catch (error: any) {
      console.error('Error saving API Key:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-api-key', async () => {
    const filePath = getApiKeyFilePath();
    try {
      const apiKey = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      return { apiKey };
    } catch (error: any) {
      console.warn('Error reading API Key file:', error.message);
      return { apiKey: null };
    }
  });
});

ipcMain.handle('navigate', async (event, targetPath) => {
  if (!mainWindow) return { success: false, error: 'Window not initialized' };

  let filePath: string;

  if (targetPath === '/') {
    filePath = path.join(__dirname, '..', 'out', 'index.html');
  } else {
    // Remove leading slash if present
    const cleanPath = targetPath.startsWith('/') ? targetPath.substring(1) : targetPath;
    filePath = path.join(__dirname, '..', 'out', `${cleanPath}.html`);
  }

  console.log("Navigating to:", filePath);

  try {
    // Use loadFile without the file:// prefix - Electron adds this automatically
    await mainWindow.loadFile(filePath);
    console.log("✅ Next.js App Loaded Successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Navigation error:", error);
    try {
      // Fallback to index page
      await mainWindow.loadFile(path.join(__dirname, '..', 'out', 'index.html'));
      return { success: false, error: error.message };
    } catch (fallbackError: any) {
      console.error("Failed to load fallback page:", fallbackError);
      return { success: false, error: `${error.message}, fallback also failed: ${fallbackError.message}` };
    }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
