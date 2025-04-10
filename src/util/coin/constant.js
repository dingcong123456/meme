import { Interface } from 'ethers';
import factoryJson from './factory.json';
import tokenJson from './token.json';
import bondJson from './bond.json';

// export const FACTORY_ADDRESS = '0x10D971a14F7b966e4Ca83bca548f913FC143Ef53';
export const FACTORY_ADDRESS ='0xca05A2eDB12ae2E919C1b5aA74d9D423090666c0';

export const FACTORY_ABI = new Interface(factoryJson).format(true);

export const TOKEN_ABI = new Interface(tokenJson).format(true);

export const BOND_ABI = new Interface(bondJson).format(true);

export const CHAIN_ID = '0xAA36A7';

export const CHAIN_NAME = 'Sepolia';

export const RPC_URLS = ['https://sepolia.infura.io/v3/6dd6664a59ab4faea5ac270b3403ea98'];