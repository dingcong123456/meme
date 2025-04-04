import { checkChain } from '@/lib/chain';
import { FACTORY_ADDRESS, FACTORY_ABI } from './constant';
import { ethers, parseEther } from 'ethers';

export const createTokenByWallet = async (address, { name, ticker }) => {
  try {
    const provider = await checkChain();
    if (!provider) {
      return false;
    }
    const signer = await provider.getSigner(address);
    const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

    const tx = await factory.createToken(name, ticker, {
      value: parseEther('0.002'),
      gasLimit: 3000000
    });
    const receipt = await tx.wait();
    console.log(receipt);

    if (receipt.status !== 1) {
      throw receipt;
    }

    const parsedData = parseCreateReceipt(receipt, factory);

    return {
      ...receipt,
      extraData: parsedData
    };
  } catch (e) {
    console.log(e);
    throw (e);
  }
}

const parseCreateReceipt = (receipt, contract) => {
  try {
    if (!receipt?.logs?.length) {
      return {};
    }
    let targetLog;
    for (const log of receipt?.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (['TokenCreated'].includes(parsedLog?.name)) {
          console.log(parsedLog);
          targetLog = parseSingleData(parsedLog, parsedLog?.name);
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }
    return targetLog;
  } catch (err) {
    console.log(err);
  }
};


const parseSingleData = (data, type) => {
  const [tokenAddress, name, symbol, owner] = data?.args || [];
  
  return {
    address: (tokenAddress || '').toLowerCase(),
    bondAddress: ''
  };
};

