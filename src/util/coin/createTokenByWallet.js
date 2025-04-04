import { FACTORY_ADDRESS, FACTORY_ABI } from './constant';
import { ethers, parseEther } from 'ethers';

export const createTokenByWallet = async (address, { name, ticker }) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  try {
    const signer = await provider.getSigner(address);
    const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
  console.log(name,ticker,11);
    const tx = await factory.createToken(name, String(ticker), {
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