const { app, BrowserWindow, ipcMain, Notification, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

// Determine if running in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const appIcon = process.platform === 'win32'
    ? path.join(__dirname, 'icon.ico')
    : path.join(__dirname, 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1080,
    minHeight: 720,
    backgroundColor: '#09090b',
    title: 'MacroRadar | Institutional Volatility & Macroeconomic Terminal',
    icon: appIcon,
    autoHideMenuBar: true,
    show: false, // Show when ready-to-show to prevent white flash
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Remove default menu for true standalone terminal experience
  Menu.setApplicationMenu(null);

  // Smooth appearance when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default system browser rather than Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Load URL or local production build
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      // Fallback to dev server if dist not built yet
      mainWindow.loadURL('http://localhost:5173');
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single Instance Lock (ensure only one terminal runs)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    setupIpcHandlers();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Native IPC Handlers
 */
function setupIpcHandlers() {
  // 1. Native Direct Calendar Fetch (Runs in Node process: zero browser CORS restrictions)
  ipcMain.handle('fetch-calendar-direct', async () => {
    try {
      const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MacroRadar-Desktop/2.4 (Windows NT 10.0; Win64; x64)',
        },
      });

      if (!response.ok) {
        throw new Error(`ForexFactory responded with HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 2. Native OS Desktop Notification
  ipcMain.handle('send-desktop-notification', (_event, { title, body }) => {
    try {
      if (Notification.isSupported()) {
        const notif = new Notification({
          title: title || 'MacroRadar Alert',
          body: body || 'Macroeconomic catalyst imminent',
          icon: path.join(__dirname, 'icon.png'),
          urgency: 'critical',
        });
        notif.show();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // 3. Platform info
  ipcMain.handle('get-platform-info', () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: app.getVersion(),
      isElectron: true,
    };
  });
}
