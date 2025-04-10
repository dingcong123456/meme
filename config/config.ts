import { Interface } from 'ethers';
import factoryJson from './MemeFactory';
import bondAbi from './bondAbi';
import tokenAbi from './tokenAbiJson';

export const TOKEN_FACTORY_ADDRESS =
  '0xca05A2eDB12ae2E919C1b5aA74d9D423090666c0';

export const TOKEN_FACTORY_ABI = new Interface(factoryJson).format(true);

export const BOND_FACTORY_ABI = new Interface(bondAbi).format(true);

export const TOKEN_ABI = new Interface(tokenAbi).format(true);
