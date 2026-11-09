const { contextBridge, ipcRenderer } = require('electron');

// Expose safe, institutional desktop APIs to the renderer window
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Direct native calendar fetch (bypassing browser CORS)
  fetchCalendarDirect: async () => {
    return ipcRenderer.invoke('fetch-calendar-direct');
  },

  // Native Desktop OS Notification
  sendDesktopNotification: async (title, body) => {
    return ipcRenderer.invoke('send-desktop-notification', { title, body });
  },

  // Platform info
  getPlatformInfo: async () => {
    return ipcRenderer.invoke('get-platform-info');
  },
});
