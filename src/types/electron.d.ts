export interface ElectronAPI {
  isElectron: boolean;
  fetchCalendarDirect: () => Promise<{ success: boolean; data?: unknown; error?: string }>;
  sendDesktopNotification: (title: string, body: string) => Promise<boolean>;
  getPlatformInfo: () => Promise<{ platform: string; arch: string; version: string; isElectron: boolean }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
