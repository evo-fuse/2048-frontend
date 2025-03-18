import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../utils/api";
import { User } from "../types";

type AuthContextType = {
  handleUser: () => Promise<any>;
  user: User | null;
  setUser: (user: User | null) => void;
  handleExistWallet: (email: string) => Promise<any>;
  handleGetWalletAddress: (email: string) => Promise<any>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleUser = async () => {
    const { data } = await api({}).get("/auth");
    console.log("data", data);
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

  useEffect(() => {
    handleUser();
  }, []);

  const value = {
    handleUser,
    user,
    setUser,
    handleExistWallet,
    handleGetWalletAddress
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
