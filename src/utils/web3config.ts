import Web3 from 'web3';

export const createWeb3Instance = (providerUrl: string): Web3 => {
    if (!providerUrl) {
        throw new Error("Provider URL is required to create a web3 instance.");
    }
    const web3 =  new Web3(
        new Web3.providers.HttpProvider(providerUrl)
    );
    return web3;
}