import { Interface } from 'ethers';
import factoryJson from './MemeFactory';
import bondAbi from './bondAbi';
import tokenAbi from './tokenAbiJson';

export const TOKEN_FACTORY_ADDRESS =
  '0x2Ff523E2a9900b42f955F682aE500F32823202F7';

export const TOKEN_FACTORY_ABI = new Interface(factoryJson).format(true);

export const BOND_FACTORY_ABI = new Interface(bondAbi).format(true);

export const TOKEN_ABI = new Interface(tokenAbi).format(true);
