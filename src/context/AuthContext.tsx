import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../utils/api";
import { User } from "../types";
import { Images } from "../assets/images";
import { getWalletFromMnemonic } from "../modules/Wallet/context/WalletCreationContext";

type AuthContextType = {
  handleUser: (address?: string) => Promise<any>;
  user: User | null;
  setUser: (user: User | null) => void;
  handleExistWallet: () => Promise<any>;
  handleGetWalletAddress: () => Promise<any>;
  handleUpdateUser: (user: Partial<User>) => Promise<any>;
  handleUpdateItem: (
    itemId: "hammer" | "upgrade" | "powerup",
    quantity: number
  ) => Promise<any>;
  cursor: string;
  setCursor: (cursor: string) => void;
  handleCreateWallet: (encData: string, password: string) => Promise<any>;
  handleGetPrivateKey: (password: string) => Promise<any>;
  handleGetSeed: (password: string) => Promise<any>;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
  handleRequestRewarding: (address: string, amount: number) => Promise<any>;
  signupUser: (address: string) => Promise<any>;
  handleDisconnectWallet: () => Promise<any>;
  handleCreateTheme: (
    themeData: FormData,
    onProgress: (status: { status: string; progress?: number; message: string }) => void
  ) => Promise<any>;
  handleWithdrawRequest: (withdrawalData: {
    network: string;
    token: string;
    amount: number;
    toAddress: string;
  }) => Promise<any>;
  exist: boolean;
  setExist: (exist: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cursor, setCursor] = useState<string>(Images.Cursor);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [exist, setExist] = useState<boolean>(false);

  const handleUser = async (address?: string) => {
    const { data } = await api({ token: address }).get("/auth");
    return data;
  };

  const signupUser = async (address: string) => {
    const { data } = await api({}).post("/auth", {
      address,
    });
    return data;
  };

  const handleExistWallet = async () => {
    const data = await window.electron.existWallet();
    return data;
  };

  const handleGetWalletAddress = async () => {
    const data = await window.electron.getAddress();
    if (data === null) throw new Error("Didn't retrieve address");
    return data;
  };

  const handleUpdateUser = async (user: Partial<User>) => {
    const { data } = await api({}).put("/auth", {
      ...user,
    });
    return data;
  };

  const handleUpdateItem = async (
    itemId: "hammer" | "upgrade" | "powerup",
    quantity: number
  ) => {
    const { data } = await api({}).put(`/auth/${itemId}`, {
      quantity,
    });
    return data;
  };

  const handleCreateWallet = async (encData: string, password: string) => {
    const unencData = getWalletFromMnemonic(encData);
    await window.electron.storeSeed(encData, unencData.address, password);
    handleUpdateUser({ address: unencData.address });
    localStorage.setItem("token", unencData.address);
    return unencData;
  };

  const handleGetPrivateKey = async (password: string) => {
    const data = await window.electron.getPrivateKey(password);
    console.log("handleGetPrivateKey", data);
    if (data === null) throw new Error("Didn't retrieve private key");
    return data;
  };

  const handleGetSeed = async (password: string) => {
    const data = await window.electron.getSeed(password);
    if (data === null) throw new Error("Didn't retrieve seed");
    return data;
  };

  const handleRequestRewarding = async (address: string, amount: number) => {
    const res = await api({}).post("/reward/send", {
      address,
      amount,
    });
    return res;
  };

  const handleDisconnectWallet = async () => {
    setPrivateKey("");
  };

  const handleCreateTheme = async (
    themeData: FormData,
    onProgress: (status: { status: string; progress?: number; message: string }) => void
  ) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/themes`, {
        method: 'POST',
        body: themeData,
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
        },
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');

      const decoder = new TextDecoder();
      let theme = null;

      // Process the stream of events
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              onProgress(data);

              if (data.status === 'complete') {
                theme = data.theme;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      return theme;
    } catch (error) {
      console.error("Error creating theme:", error);
      onProgress({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create theme'
      });
      throw error;
    }
  };

  const handleWithdrawRequest = async (withdrawalData: {
    network: string;
    token: string;
    amount: number;
    toAddress: string;
  }) => {
    const { data } = await api({}).post("/balance/withdraw", withdrawalData);
    return data;
  };

  useEffect(() => {
    handleExistWallet().then((exist) => {
      if (exist) {
        handleGetWalletAddress().then((address) => {
          localStorage.setItem("token", address);
          handleUser(address).then((data) => {
            setUser({ ...data, address });
          });
        });
      }
    });
  }, []);

  const value = {
    handleUser,
    user,
    setUser,
    handleExistWallet,
    handleGetWalletAddress,
    handleUpdateUser,
    handleUpdateItem,
    cursor,
    setCursor,
    handleCreateWallet,
    handleGetPrivateKey,
    handleGetSeed,
    privateKey,
    setPrivateKey,
    handleRequestRewarding,
    signupUser,
    handleDisconnectWallet,
    handleCreateTheme,
    handleWithdrawRequest,
    exist,
    setExist,
  };

  return (
    <AuthContext.Provider value={{ ...value }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
