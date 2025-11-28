import Web3 from 'web3';

export const createWeb3Instance = (providerUrl: string): Web3 => {
    if (!providerUrl) {
        throw new Error("Provider URL is required to create a web3 instance.");
    }
    const web3 = new Web3(providerUrl);
    
    // Configure transaction confirmation timeout (60 seconds instead of 750)
    web3.eth.transactionPollingTimeout = 60000; // 60 seconds (in milliseconds)
    web3.eth.transactionPollingInterval = 1000; // Check every 1 second
    web3.eth.transactionConfirmationBlocks = 1; // Wait for 1 confirmation
    
    return web3;
}