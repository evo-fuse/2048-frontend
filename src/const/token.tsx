import { TToken } from '../types';
import axios from 'axios';
import { Images } from '../assets/images';

export const API_KEY = {
  ETH: 'R8IKIIPAJKC9TZDCV3W17N62VZ99BZJD87',
  POL: 'FQTFJ3SZY4726GDTT83ZIYJHY21TJS5WXI',
  BNB: 'I4WZIXVBR7KRTNZY1P6VIGEN29R2U737MK',
  ARB: '6KVU5REZUYBQCC8KR573YF7I91NY98BEIN',
  FUSE: '83267ee1-fdd9-4800-891b-786ab1c7ec63',
};

export const CONTRACT_ADDRESS = {
  PUSDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  PUSDC: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  EUSDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  EUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  AUSDT: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  AUSDC: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  BUSDT: '0x55d398326f99059fF775485246999027B3197955',
  BUSDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  FUSDT: '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10',
  FUSDC: '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5',
};

export const CONTRACT_ABI = {
  PUSDT: [{"inputs":[{"internalType":"address","name":"_proxyTo","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_new","type":"address"},{"indexed":false,"internalType":"address","name":"_old","type":"address"}],"name":"ProxyOwnerUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_new","type":"address"},{"indexed":true,"internalType":"address","name":"_old","type":"address"}],"name":"ProxyUpdated","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyType","outputs":[{"internalType":"uint256","name":"proxyTypeId","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferProxyOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newProxyTo","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"updateAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_newProxyTo","type":"address"}],"name":"updateImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
  PUSDC: [{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}],
  EUSDT: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_upgradedAddress","type":"address"}],"name":"deprecate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"deprecated","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_evilUser","type":"address"}],"name":"addBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maximumFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_maker","type":"address"}],"name":"getBlackListStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newBasisPoints","type":"uint256"},{"name":"newMaxFee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"basisPointsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isBlackListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_clearedUser","type":"address"}],"name":"removeBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_UINT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blackListedUser","type":"address"}],"name":"destroyBlackFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}],
  EUSDC: [{"constant":false,"inputs":[{"name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newImplementation","type":"address"},{"name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"implementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_implementation","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"previousAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"implementation","type":"address"}],"name":"Upgraded","type":"event"}],
  AUSDT: [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}],
  AUSDC: [{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}],
  BUSDT: [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
  BUSDC: [{"inputs":[{"internalType":"address","name":"logic","type":"address"},{"internalType":"address","name":"admin","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
}

export const BASEURL = {
  ETH: 'https://api.etherscan.io/api',
  POL: 'https://api.polygonscan.com/api',
  BNB: 'https://api.bscscan.com/api',
  ARB: 'https://api.arbiscan.io/api',
  FUSE: 'https://explorer.fuse.io/api/v2',
};

export const ETH: TToken = {
  unit: 'ETH',
  icon: <img src={Images.ETH} className='w-8 h-8 rounded-full' />,
  name: 'eth',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.ETH}?module=account&action=balance&apikey=${API_KEY.ETH}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const POL: TToken = {
  unit: 'POL',
  icon: <img src={Images.POL} className='w-8 h-8 rounded-full' />,
  name: 'pol',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.POL}?module=account&action=balance&apikey=${API_KEY.POL}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const BNB: TToken = {
  unit: 'BNB',
  icon: <img src={Images.BNB} className='w-8 h-8 rounded-full' />,
  name: 'bnb',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.BNB}?module=account&action=balance&apikey=${API_KEY.BNB}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const ARB: TToken = {
  unit: 'ARB',
  icon: <img src={Images.ARB} className="w-8 h-8 rounded-full" />,
  name: 'arb',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.ARB}?module=account&action=balance&apikey=${API_KEY.ARB}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const PUSDT: TToken = {
  unit: 'USDT',
  icon: (
    <div className="relative">
      <img src={Images.USDT} className="w-8 h-8 rounded-full" />
      <img
        src={Images.POL}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'pusdt',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.POL}?module=account&action=tokenbalance&apikey=${API_KEY.POL}&contractaddress=${CONTRACT_ADDRESS.PUSDT}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const BUSDT: TToken = {
  unit: 'USDT',
  icon: (
    <div className="relative">
      <img src={Images.USDT} className="w-8 h-8 rounded-full" />
      <img
        src={Images.BNB}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'busdt',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.BNB}?module=account&action=tokenbalance&apikey=${API_KEY.BNB}&contractaddress=${CONTRACT_ADDRESS.BUSDT}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const EUSDT: TToken = {
  unit: 'USDT',
  icon: (
    <div className="relative">
      <img src={Images.USDT} className="w-8 h-8 rounded-full" />
      <img
        src={Images.ETH}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'eusdt',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.ETH}?module=account&action=tokenbalance&apikey=${API_KEY.ETH}&contractaddress=${CONTRACT_ADDRESS.EUSDT}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const PUSDC: TToken = {
  unit: 'USDC',
  icon: (
    <div className="relative">
      <img src={Images.USDC} className="w-8 h-8 rounded-full" />
      <img
        src={Images.POL}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'pusdc',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.POL}?module=account&action=tokenbalance&apikey=${API_KEY.POL}&contractaddress=${CONTRACT_ADDRESS.PUSDC}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const BUSDC: TToken = {
  unit: 'USDC',
  icon: (
    <div className="relative">
      <img src={Images.USDC} className="w-8 h-8 rounded-full" />
      <img
        src={Images.BNB}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'busdc',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.BNB}?module=account&action=tokenbalance&apikey=${API_KEY.BNB}&contractaddress=${CONTRACT_ADDRESS.BUSDC}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const EUSDC: TToken = {
  unit: 'USDC',
  icon: (
    <div className="relative">
      <img src={Images.USDC} className="w-8 h-8 rounded-full" />
      <img
        src={Images.ETH}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'eusdc',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.ETH}?module=account&action=tokenbalance&apikey=${API_KEY.ETH}&contractaddress=${CONTRACT_ADDRESS.EUSDC}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const AUSDT: TToken = {
  unit: 'USDT',
  icon: (
    <div className="relative">
      <img src={Images.USDT} className="w-8 h-8 rounded-full" />
      <img
        src={Images.ARB}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'ausdt',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.ARB}?module=account&action=tokenbalance&apikey=${API_KEY.ARB}&contractaddress=${CONTRACT_ADDRESS.AUSDT}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const AUSDC: TToken = {
  unit: 'USDC',
  icon: (
    <div className="relative">
      <img src={Images.USDC} className="w-8 h-8 rounded-full" />
      <img
        src={Images.ARB}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'eusdc',
  balance: async (address: string) => {
    const response = await axios.get(
      `${BASEURL.ARB}?module=account&action=tokenbalance&apikey=${API_KEY.ARB}&contractaddress=${CONTRACT_ADDRESS.AUSDC}&address=${address}`,
    );
    return (Number(response.data.result) / 10 ** 18).toFixed(5);
  },
};

export const FUSE: TToken = {
  unit: 'FUSE',
  icon: <img src={Images.FUSE} className="w-8 h-8 rounded-full" />,
  name: 'fuse',
  balance: async (address: string) => {
    if (!address) return '0';
    const response = await axios.get(
      `${BASEURL.FUSE}/addresses/${address}?apikey=${API_KEY.FUSE}`,
    );
    return (Number(response.data.coin_balance) / 10 ** 18).toFixed(5);
  },
};

export const FUSDT: TToken = {
  unit: 'USDT',
  icon: (
    <div className="relative">
      <img src={Images.USDT} className="w-8 h-8 rounded-full" />
      <img
        src={Images.FUSE}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'fusdt',
  balance: async (address: string) => {
    if (!address) return '0';
    const { data } = await axios.get(
      `${BASEURL.FUSE}/addresses/${address}/tokens?apikey=${API_KEY.FUSE}&type=ERC-20`,
    );
    const items: any[] = data.items;
    const item = items.find((item: any) => item.token.symbol === 'USDT');
    return (Number(item?.value || 0) / 10 ** 18).toFixed(5);
  },
};

export const FUSDC: TToken = {
  unit: 'USDC',
  icon: (
    <div className="relative">
      <img src={Images.USDC} className="w-8 h-8 rounded-full" />
      <img
        src={Images.FUSE}
        className="absolute -bottom-1 -right-2 rounded w-5 h-5"
      />
    </div>
  ),
  name: 'fusdc',
  balance: async (address: string) => {
    if (!address) return '0';
    const { data } = await axios.get(
      `${BASEURL.FUSE}/addresses/${address}/tokens?apikey=${API_KEY.FUSE}&type=ERC-20`,
    );
    const items: any[] = data.items;
    const item = items.find((item: any) => item.token.symbol === 'USDC');
    return (Number(item?.value || 0) / 10 ** 18).toFixed(5);
  },
};
