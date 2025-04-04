'use client';
import { Button } from 'antd'
import { ethers, formatEther, Interface, parseEther  } from 'ethers';
import json from './MemeCoinFactory.json';

const TestButton = () => {
  const factoryAbi = new Interface(json).format();
  const handleClick = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask first.");
      return;
    }
    console.log(formatEther('5000000000000000000000000'));
    console.log(formatEther('10000000000000'));
    return
    try {
      
      const factoryAddress = "0x20bEA69Da229EbBC36a2461f81dD8F63e530B0e5";

      const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);
      // const res = await factory.owner();
      // console.log(res);
      const tx = await factory.createToken('name', 'ticker2', {
        value: parseEther('0.02'),
        gasLimit: 2000000
      });

      const receipt = await tx.wait();

      console.log(receipt);

       // const result = await provider.getTransactionReceipt('0x6ca6a715788099a47c4229839f1120a4aee92a465d0f0b644061b92a5d042487');
      // console.log(result);

      // const event = receipt.events.find((e) => e.event === "TokenCreated");
      // console.log(event.args.tokenAddress);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
      >
        test
      </Button>
    </div>
  )
}

export default TestButton