export {};

declare global {
  interface Window {
    electron: {
      ping: () => string;
      openExternal: (url: string) => Promise<void>;
      closeApp: () => void;
      toggleFullScreen: () => void;
      getFullScreen: () => Promise<boolean>;
      onEnterFullScreen: (callback: () => void) => void;
      onLeaveFullScreen: (callback: () => void) => void;
      removeFullScreenListeners: () => void;
    };
  }
} 