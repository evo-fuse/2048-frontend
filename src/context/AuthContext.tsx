import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../utils/api";
import { User } from "../types";
import { Images } from "../assets/images";
import { getWalletFromMnemonic } from "../modules/Wallet/context/WalletCreationContext";

type AuthContextType = {
  handleUser: () => Promise<any>;
  user: User | null;
  setUser: (user: User | null) => void;
  handleExistWallet: (email: string) => Promise<any>;
  handleGetWalletAddress: (email: string) => Promise<any>;
  handleUpdateUser: (user: Partial<User>) => Promise<any>;
  handleUpdateItem: (
    itemId: "hammer" | "upgrade" | "powerup",
    quantity: number
  ) => Promise<any>;
  cursor: string;
  setCursor: (cursor: string) => void;
  handleCreateWallet: (
    encData: string,
    password: string,
    email: string
  ) => Promise<void>;
  handleGetPrivateKey: (email: string, password: string) => Promise<any>;
  handleGetSeed: (email: string, password: string) => Promise<any>;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
  handleRequestRewarding: (address: string, amount: number) => Promise<any>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cursor, setCursor] = useState<string>(Images.Cursor);
  const [privateKey, setPrivateKey] = useState<string>("");

  const handleUser = async () => {
    const { data } = await api({}).get("/auth");
    return data;
  };

  const handleExistWallet = async (email: string) => {
    const { data } = await api({
      baseURL: import.meta.env.VITE_LOCAL_URL,
    }).post("/exist-wallet", {
      email,
    });
    return data;
  };

  const handleGetWalletAddress = async (email: string) => {
    const { data } = await api({ baseURL: import.meta.env.VITE_LOCAL_URL }).get(
      `/get-address/${email}`
    );
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

  const handleCreateWallet = async (
    encData: string,
    password: string,
    email: string
  ) => {
    const unencData = getWalletFromMnemonic(encData);
    await api({ baseURL: import.meta.env.VITE_LOCAL_URL }).post("/store-seed", {
      encData,
      password,
      email,
      unencData: unencData.address,
    });
  };

  const handleGetPrivateKey = async (email: string, password: string) => {
    const { data } = await api({
      baseURL: import.meta.env.VITE_LOCAL_URL,
    }).post("/get-private-key", {
      email,
      password,
    });
    return data;
  };

  const handleGetSeed = async (email: string, password: string) => {
    const { data } = await api({
      baseURL: import.meta.env.VITE_LOCAL_URL,
    }).post("/get-seed", {
      email,
      password,
    });
    return data;
  };

  const handleRequestRewarding = async (address: string, amount: number) => {
    const res = await api({}).post("/reward/send", {
      address,
      amount,
    });
    return res;
  };

  useEffect(() => {
    handleUser().then((data) => {
      setUser(data);
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
