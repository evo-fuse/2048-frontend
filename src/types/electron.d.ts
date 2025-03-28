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
      secureLocalRequest: (url: string, options?: any) => Promise<any>;
      openExternalAuth: (url: string) => void;
      authWithBrowser: (authUrl: string) => Promise<string | null>;
      storeSeed: (encData: any, unencData: any, password: string) => Promise<boolean>;
      getSeed: (password: string) => Promise<string | null>;
      getPrivateKey: (password: string) => string | null;
      getAddress: () => Promise<string | null>;
      existWallet: () => Promise<boolean>;
    };
  }
} 