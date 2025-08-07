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

  const buyThemesWithUSD = async (
    tokenType: string | null,
    amount: number,
    creatorAddress?: string
  ): Promise<any> => {
    const networkName = getNetworkFromToken(tokenType as string);
    const providerUrl = getProviderUrl(tokenType || "");
    const web3_2: Web3 = createWeb3Instance(providerUrl);
    if (account) {
      try {
        // Make sure account is added to this web3 instance
        web3_2.eth.accounts.wallet.add(account);
        web3_2.eth.defaultAccount = account.address;

        // Get the token contract on the source network
        if (
          !contractByName[networkName] ||
          !contractByName[networkName][tokenType?.toLowerCase() as string]
        ) {
          Toast.error(
            "Token not supported",
            `Token ${tokenType} not supported on ${networkName}`
          );
          console.error(`Token ${tokenType} not supported on ${networkName}`)
          return null; // Return null instead of undefined when token is not supported
        }

        const tokenContractInfo =
          contractByName[networkName][tokenType?.toLowerCase() as string];
        const contract = new web3_2.eth.Contract(
          tokenContractInfo.abi,
          tokenContractInfo.address
        );

        const receiverAddress = CONFIG.RECEIVER_ADDRESS;

        // Convert amount to proper format if needed (e.g., for tokens with decimals)
        // Check the decimals of the token
        const decimals = await contract.methods.decimals().call();
        const amountInSmallestUnit = web3_2.utils.toBigInt(
          (BigInt(amount) * BigInt(10 ** Number(decimals))) / BigInt(10 ** 2)
        );

        let transferData;
        let transferTransaction;
        const gasPrice: bigint = await web3_2.eth.getGasPrice();

        // If creator address is provided and different from receiver address, split payment
        if (creatorAddress && creatorAddress !== receiverAddress) {
          // Calculate 90% for creator and 10% for receiver
          const creatorAmount = (amountInSmallestUnit * BigInt(90)) / BigInt(100);
          const receiverAmount = amountInSmallestUnit - creatorAmount;

          // First transfer to creator (90%)
          const creatorTransferData = contract.methods
            .transfer(creatorAddress, creatorAmount)
            .encodeABI();

          const creatorTransaction = {
            from: account.address,
            to: contract.options.address,
            gas: 100000,
            gasPrice: gasPrice,
            data: creatorTransferData,
          };

          const creatorSignedTx = await web3_2.eth.accounts.signTransaction(
            creatorTransaction,
            account.privateKey
          );

          // Send first transaction to creator
          const creatorReceipt = await web3_2.eth.sendSignedTransaction(creatorSignedTx.rawTransaction!);
          console.log("Creator transaction receipt:", creatorReceipt);

          // Then transfer to receiver (10%)
          transferData = contract.methods
            .transfer(receiverAddress, receiverAmount)
            .encodeABI();

          transferTransaction = {
            from: account.address,
            to: contract.options.address,
            gas: 100000,
            gasPrice: gasPrice,
            data: transferData,
          };
        } else {
          // Standard transfer to receiver (100%)
          transferData = contract.methods
            .transfer(receiverAddress, amountInSmallestUnit)
            .encodeABI();

          transferTransaction = {
            from: account.address,
            to: contract.options.address,
            gas: 100000,
            gasPrice: gasPrice,
            data: transferData,
          };
        }

        const signedTx = await web3_2.eth.accounts.signTransaction(
          transferTransaction,
          account.privateKey
        );

        // Return a properly resolved promise with transaction data
        return new Promise((resolve, reject) => {
          const promiEvent = web3_2.eth.sendSignedTransaction(
            signedTx.rawTransaction!
          );

          promiEvent
            .on("transactionHash", (hash) => {
              console.log("Transaction hash:", hash);
              // You can use this to track the transaction
            })
            .then((receipt) => {
              console.log("Transaction receipt:", receipt);
              Toast.success("Congratulations!", "Payment successful!");
              // Make sure we're returning a complete object with all needed data
              resolve({
                transactionHash: receipt.transactionHash,
                from: receipt.from,
                to: receipt.to,
                blockNumber: receipt.blockNumber,
                status: receipt.status,
                // Include any other fields that might be needed
              });
            })
            .catch((error) => {
              console.error("Transaction error:", error);

              // More detailed error handling
              if (
                error.message.includes(
                  "Transaction has been reverted by the EVM"
                )
              ) {
                // Try to get more specific information about why it was reverted

                // Check if there's a reason string
                if (error.message.includes("reason string")) {
                  const reasonMatch = error.message.match(
                    /reason string: '(.+)'/
                  );
                  if (reasonMatch && reasonMatch[1]) {
                    Toast.error("Transaction reverted", reasonMatch[1]);
                  }
                } else {
                  // Check for common ERC20 revert reasons
                  checkCommonERC20Errors(
                    web3_2,
                    contract,
                    account.address,
                    receiverAddress,
                    amountInSmallestUnit.toString()
                  )
                    .then((reason) => {
                      if (reason) {
                        Toast.error("Transaction reverted", reason);
                      } else {
                        Toast.error(
                          "Transaction reverted",
                          "Check if the contract has transfer restrictions."
                        );
                      }
                    })
                    .catch(() => {
                      Toast.error(
                        "Transaction reverted",
                        "Check if the contract has transfer restrictions."
                      );
                    });
                }
              } else if (error.message.includes("insufficient funds")) {
                Toast.error("Payment Failed", "Can't pay gas. Native token is not enough.");
              } else if (error.message.includes("nonce too low")) {
                Toast.error(
                  "Payment Failed",
                  "Transaction nonce issue. Try again."
                );
              } else if (error.message.includes("gas limit")) {
                Toast.error(
                  "Payment Failed",
                  "Gas limit issue. Try with higher gas."
                );
              } else {
                Toast.error("Payment failed", error.message || "Unknown error");
              }

              reject(error);
            });
        });
      } catch (error: any) {
        console.log("Transaction failed:", error.message.toString());
        Toast.error("Payment failed", error.message || "Unknown error");
        throw error;
      }
    }
    return null; // Return null if account is not available
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
        Toast.success("Congratulations!", "Paid successfully!");
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
