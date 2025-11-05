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
    showSaveFilePicker: (options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
    ethers?: {
      utils?: {
        formatEther?: (wei: string | number | bigint) => string;
        parseEther?: (eth: string) => string;
        formatUnits?: (value: string | number | bigint, unitName?: string | number) => string;
        parseUnits?: (value: string, unitName?: string | number) => string;
        isAddress?: (address: string) => boolean;
        getAddress?: (address: string) => string;
      };
      providers?: {
        Web3Provider?: new (provider: any) => any;
        JsonRpcProvider?: new (url: string) => any;
      };
      Contract?: new (
        address: string,
        abi: any,
        signerOrProvider?: any
      ) => any;
      BigNumber?: {
        from: (value: string | number | bigint) => any;
        toBigInt: (value: any) => bigint;
      };
      Wallet?: new (privateKey: string, provider?: any) => any;
      getDefaultProvider?: (network?: string) => any;
    };
  }
} 