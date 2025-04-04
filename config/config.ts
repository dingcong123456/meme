import { Interface } from 'ethers';
import factoryJson from './MemeFactory';
import bondAbi from './bondAbi';
import tokenAbi from './tokenAbiJson';

export const TOKEN_FACTORY_ADDRESS =
  '0x28a7743bD45cF21347836b91F9Fdc27Bfc3c8181';

export const TOKEN_FACTORY_ABI = new Interface(factoryJson).format(true);

export const BOND_FACTORY_ABI = new Interface(bondAbi).format(true);

export const TOKEN_ABI = new Interface(tokenAbi).format(true);
