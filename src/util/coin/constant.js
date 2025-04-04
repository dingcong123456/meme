import { Interface } from 'ethers';
import factoryJson from './factory.json';
import tokenJson from './token.json';
import bondJson from './bond.json';

export const FACTORY_ADDRESS = '0x55F6F8Feb82538B38CE523Dfef96Cbf550B918F9';

export const FACTORY_ABI = new Interface(factoryJson).format(true);

export const TOKEN_ABI = new Interface(tokenJson).format(true);

export const BOND_ABI = new Interface(bondJson).format(true);
