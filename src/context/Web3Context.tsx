import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Toast } from "../components";
import { Web3, Web3BaseWalletAccount } from "web3";
import { TOKEN_CONTRACT_INFO, REWARD_CONTRACT_INFO } from "../contracts";
import { CONFIG, TOKEN } from "../const";
import { createWeb3Instance } from "../utils/web3config";
import { useAuthContext } from "./AuthContext";

interface Web3ContextType {
  web3: Web3;
  account: string;
  tokenContract: any;
  rewardContract: any;
  userBalance: bigint | number;
  setUserBalance: (userBalance: bigint) => void;
  getBalance: () => Promise<any>;
  getUserGameTokenBalance: () => Promise<any>;
  buyItemsWithGameTokens: (amount: number) => Promise<any>;
  buyThemesWithUSD: (tokenType: string | null, amount: number, creatorAddress?: string) => Promise<any>;
  transferTokens: (
    tokenType: string,
    amount: number,
    toAddress: string,
    options?: {
      divideBy?: number;
      gasLimit?: number;
      successMessage?: string;
    }
  ) => Promise<any>;
  getRewardContractGameTokenBalance: () => Promise<any>;
}

interface ContractInfo {
  abi: any; // Replace with the actual type of your ABI if available
  address: string;
}

interface ContractByName {
  [network: string]: {
    [tokenType: string]: ContractInfo;
  };
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, privateKey } = useAuthContext();
  const [account, setAccount] = useState<Web3BaseWalletAccount | null>(null);
  const [userBalance, setUserBalance] = useState<bigint | number>(0);
  const web3: Web3 = createWeb3Instance(CONFIG.FUSE_PROVIDER_URL);

  useEffect(() => {
    getBalance();
  }, [account, user]);

  useEffect(() => {
    if (privateKey !== "") {
      setAccount(web3.eth.accounts.privateKeyToAccount(privateKey));
    }
  }, [privateKey]);

  useEffect(() => {
    if (account) {
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;
    }
  }, [account]);

  const getBalance = async () => {
    const userbal = await getUserGameTokenBalance();
    setUserBalance(userbal);
  };

  const getContracts = () => {
    const tokenContract = new web3.eth.Contract(
      TOKEN_CONTRACT_INFO.abi as any,
      TOKEN_CONTRACT_INFO.address
    );

    const rewardContract = new web3.eth.Contract(
      REWARD_CONTRACT_INFO.abi as any,
      REWARD_CONTRACT_INFO.address
    );

    return { tokenContract, rewardContract };
  };

  const { tokenContract, rewardContract } = getContracts();

  const contractByName: ContractByName = {
    fuse: {
      fusdt: {
        abi: TOKEN.CONTRACT_ABI.FUSDT,
        address: TOKEN.CONTRACT_ADDRESS.FUSDT,
      },
      fusdc: {
        abi: TOKEN.CONTRACT_ABI.FUSDC,
        address: TOKEN.CONTRACT_ADDRESS.FUSDC,
      },
    },
    ethereum: {
      eusdt: {
        abi: TOKEN.CONTRACT_ABI.EUSDT,
        address: TOKEN.CONTRACT_ADDRESS.EUSDT
      },
      eusdc: {
        abi: TOKEN.CONTRACT_ABI.EUSDC,
        address: TOKEN.CONTRACT_ADDRESS.EUSDC
      }
    },
    binance: {
      busdt: {
        abi: TOKEN.CONTRACT_ABI.BUSDT,
        address: TOKEN.CONTRACT_ADDRESS.BUSDT,
      },
      busdc: {
        abi: TOKEN.CONTRACT_ABI.BUSDC,
        address: TOKEN.CONTRACT_ADDRESS.BUSDC,
      },
    },
    arbitrum: {
      ausdt: {
        abi: TOKEN.CONTRACT_ABI.AUSDT,
        address: TOKEN.CONTRACT_ADDRESS.AUSDT,
      },
      ausdc: {
        abi: TOKEN.CONTRACT_ABI.AUSDC,
        address: TOKEN.CONTRACT_ADDRESS.AUSDC,
      },
    },
    polygon: {
      pusdt: {
        abi: TOKEN.CONTRACT_ABI.PUSDT,
        address: TOKEN.CONTRACT_ADDRESS.PUSDT,
      },
      pusdc: {
        abi: TOKEN.CONTRACT_ABI.PUSDC,
        address: TOKEN.CONTRACT_ADDRESS.PUSDC,
      },
    },
  };

  const getUserGameTokenBalance = async () => {
    if (user) {
      const balance: bigint = await tokenContract.methods
        .balanceOf(user.address)
        .call();
      return balance / BigInt(10 ** 18);
    }
    return BigInt(0);
  };

  const getRewardContractGameTokenBalance = async () => {
    if (account) {
      const balance: bigint = await tokenContract.methods
        .balanceOf(String(REWARD_CONTRACT_INFO.address))
        .call();
      return balance;
    }
    return BigInt(0);
  };

  /**
   * Get a token contract instance for a specific token type
   */
  const getTokenContract = (
    web3Instance: Web3,
    tokenType: string,
    networkName: string
  ) => {
    if (
      !contractByName[networkName] ||
      !contractByName[networkName][tokenType?.toLowerCase()]
    ) {
      throw new Error(`Token ${tokenType} not supported on ${networkName}`);
    }

    const tokenContractInfo =
      contractByName[networkName][tokenType?.toLowerCase()];
    
    return new web3Instance.eth.Contract(
      tokenContractInfo.abi,
      tokenContractInfo.address
    );
  };

  /**
   * Convert amount to token's smallest unit based on decimals
   */
  const convertAmountWithDecimals = async (
    web3Instance: Web3,
    contract: any,
    amount: number,
    divideBy: number = 100
  ): Promise<bigint> => {
    const decimals = await contract.methods.decimals().call();
    return web3Instance.utils.toBigInt(
      (BigInt(amount) * BigInt(10 ** Number(decimals))) / BigInt(divideBy)
    );
  };

  /**
   * Prepare a token transfer transaction
   */
  const prepareTransferTransaction = async (
    web3Instance: Web3,
    contract: any,
    fromAddress: string,
    toAddress: string,
    amount: bigint,
    gasLimit: number = 100000
  ) => {
    const transferData = contract.methods
      .transfer(toAddress, amount)
      .encodeABI();

    const gasPrice: bigint = await web3Instance.eth.getGasPrice();

    return {
      from: fromAddress,
      to: contract.options.address,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: transferData,
    };
  };

  /**
   * Handle transaction errors with specific error messages
   */
  const handleTransactionError = async (
    error: any,
    web3Instance: Web3,
    contract: any,
    fromAddress: string,
    toAddress: string,
    amount: string
  ) => {
    console.error("Transaction error:", error);

    if (error.message.includes("Transaction has been reverted by the EVM")) {
      if (error.message.includes("reason string")) {
        const reasonMatch = error.message.match(/reason string: '(.+)'/);
        if (reasonMatch && reasonMatch[1]) {
          Toast.error("Transaction reverted", reasonMatch[1]);
          return;
        }
      }

      try {
        const reason = await checkCommonERC20Errors(
          web3Instance,
          contract,
          fromAddress,
          toAddress,
          amount
        );
        Toast.error(
          "Transaction reverted",
          reason || "Check if the contract has transfer restrictions."
        );
      } catch {
        Toast.error(
          "Transaction reverted",
          "Check if the contract has transfer restrictions."
        );
      }
    } else if (error.message.includes("insufficient funds")) {
      Toast.error("Payment Failed", "Can't pay gas. Native token is not enough.");
    } else if (error.message.includes("nonce too low")) {
      Toast.error("Payment Failed", "Transaction nonce issue. Try again.");
    } else if (error.message.includes("gas limit")) {
      Toast.error("Payment Failed", "Gas limit issue. Try with higher gas.");
    } else {
      Toast.error("Payment failed", error.message || "Unknown error");
    }
  };

  /**
   * Sign and send a transaction with comprehensive error handling
   */
  const signAndSendTransaction = async (
    web3Instance: Web3,
    transaction: any,
    privateKey: string,
    contract: any,
    successMessage: string = "Payment successful!"
  ): Promise<any> => {
    const signedTx = await web3Instance.eth.accounts.signTransaction(
      transaction,
      privateKey
    );

    return new Promise((resolve, reject) => {
      const promiEvent = web3Instance.eth.sendSignedTransaction(
        signedTx.rawTransaction!
      );

      promiEvent
        .on("transactionHash", (hash) => {
          console.log("Transaction hash:", hash);
        })
        .then((receipt) => {
          console.log("Transaction receipt:", receipt);
          resolve({
            transactionHash: receipt.transactionHash,
            from: receipt.from,
            to: receipt.to,
            blockNumber: receipt.blockNumber,
            status: receipt.status,
          });
        })
        .catch((error) => {
          handleTransactionError(
            error,
            web3Instance,
            contract,
            transaction.from,
            transaction.to,
            transaction.data
          );
          reject(error);
        });
    });
  };

  /**
   * Setup Web3 instance with account
   */
  const setupWeb3WithAccount = (
    web3Instance: Web3,
    accountInstance: Web3BaseWalletAccount
  ) => {
    web3Instance.eth.accounts.wallet.add(accountInstance);
    web3Instance.eth.defaultAccount = accountInstance.address;
  };

  /**
   * Generalized token transfer function
   */
  const transferTokens = async (
    tokenType: string,
    amount: number,
    toAddress: string,
    options: {
      divideBy?: number;
      gasLimit?: number;
      successMessage?: string;
    } = {}
  ): Promise<any> => {
    if (!account) {
      return null;
    }

    const { divideBy = 100, gasLimit = 100000, successMessage = "Payment successful!" } = options;

    try {
      const networkName = getNetworkFromToken(tokenType);
      const providerUrl = getProviderUrl(tokenType);
      const web3Instance = createWeb3Instance(providerUrl);

      setupWeb3WithAccount(web3Instance, account);

      const contract = getTokenContract(web3Instance, tokenType, networkName);
      const amountInSmallestUnit = await convertAmountWithDecimals(
        web3Instance,
        contract,
        amount,
        divideBy
      );

      const transaction = await prepareTransferTransaction(
        web3Instance,
        contract,
        account.address,
        toAddress,
        amountInSmallestUnit,
        gasLimit
      );

      return await signAndSendTransaction(
        web3Instance,
        transaction,
        account.privateKey,
        contract,
        successMessage
      );
    } catch (error: any) {
      console.log("Transaction failed:", error.message?.toString() || error);
      
      if (error.message?.includes("not supported")) {
        Toast.error("Token not supported", error.message);
      } else {
        Toast.error("Payment failed", error.message || "Unknown error");
      }
      
      throw error;
    }
  };

  /**
   * Buy themes with USD tokens (backward compatibility wrapper)
   */
  const buyThemesWithUSD = async (
    tokenType: string | null,
    amount: number,
    creatorAddress?: string
  ): Promise<any> => {
    if (!tokenType) {
      return null;
    }

    const toAddress = creatorAddress || CONFIG.RECEIVER_ADDRESS;
    return await transferTokens(tokenType, amount, toAddress);
  };

  const buyItemsWithGameTokens = async (amount: number): Promise<any> => {
    const providerUrl = CONFIG.FUSE_PROVIDER_URL;
    const web3_2: Web3 = createWeb3Instance(providerUrl);
    if (account) {
      try {
        const gasPrice: bigint = await web3_2.eth.getGasPrice();
        const gasLimit: bigint = await tokenContract.methods
          .transfer(REWARD_CONTRACT_INFO.address, BigInt(amount * 10 ** 18))
          .estimateGas({ from: account.address });
        const paymentData = tokenContract.methods
          .transfer(REWARD_CONTRACT_INFO.address, BigInt(amount * 10 ** 18))
          .encodeABI();
        const paymentTransaction = {
          from: account.address,
          to: TOKEN_CONTRACT_INFO.address,
          gas: gasLimit,
          gasPrice: gasPrice,
          data: paymentData,
        };
        const signedTx = await web3_2.eth.accounts.signTransaction(
          paymentTransaction,
          account.privateKey
        );
        await web3_2.eth.sendSignedTransaction(signedTx.rawTransaction!);
      } catch (error: any) {
        console.error("Transaction failed:", error);
        if (error.message.includes("cannot pay gas")) {
          Toast.error(
            "Payment failed",
            "Fuse is not enough. Please buy some Fuse to confirm the transaction."
          );
        } else {
          Toast.error("Payment failed", error.message || "Unknown error");
        }
        throw error;
      }
    }
  };

  const getNetworkFromToken = (tokenType: string): string => {
    if (tokenType.startsWith("b")) return "binance";
    if (tokenType.startsWith("a")) return "arbitrum";
    if (tokenType.startsWith("p")) return "polygon";
    return "fuse";
  };

  const getProviderUrl = (network: string) => {
    switch (network) {
      case "busdt":
      case "busdc":
        return CONFIG.BNB_PROVIDER_URL;
      case "ausdt":
      case "ausdc":
        return CONFIG.ABT_PROVIDER_URL;
      case "pusdt":
      case "pusdc":
        return CONFIG.POL_PROVIDER_URL;
      default:
        return CONFIG.FUSE_PROVIDER_URL;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        account: account?.address || "",
        tokenContract,
        rewardContract,
        userBalance,
        setUserBalance,
        getBalance,
        getUserGameTokenBalance,
        buyItemsWithGameTokens,
        buyThemesWithUSD,
        transferTokens,
        getRewardContractGameTokenBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3Context must be used within a Web3Provider");
  }
  return context;
};

// Helper function to check for common ERC20 revert reasons
async function checkCommonERC20Errors(
  _web3: Web3,
  contract: any,
  fromAddress: string,
  toAddress: string,
  amount: string
) {
  try {
    // Check if sender has enough balance
    const balance = await contract.methods.balanceOf(fromAddress).call();
    if (BigInt(balance) < BigInt(amount)) {
      return "Insufficient token balance";
    }

    // Check if contract has a paused state
    try {
      const isPaused = await contract.methods.paused().call();
      if (isPaused) {
        return "Token transfers are paused";
      }
    } catch (e) {}

    // Check for blacklisting
    try {
      const isBlacklisted = await contract.methods
        .isBlacklisted(fromAddress)
        .call();
      if (isBlacklisted) {
        return "Sender address is blacklisted";
      }
    } catch (e) {}

    // Check for transfer restrictions
    try {
      const canTransfer = await contract.methods
        .canTransfer(fromAddress, toAddress, amount)
        .call();
      if (!canTransfer) {
        return "Transfer is restricted by the contract";
      }
    } catch (e) {}

    return null;
  } catch (error) {
    console.error("Error checking for common ERC20 issues:", error);
    return null;
  }
}
