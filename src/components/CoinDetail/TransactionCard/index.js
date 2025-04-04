'use client'
import { GlobalContext } from '@/context/global';
import { createTokenTransaction } from '@/request/token';
import { BOND_ABI, FACTORY_ABI, FACTORY_ADDRESS, TOKEN_ABI } from '@/util/coin/constant';
import { parseReceipt } from '@/util/coin/parseReceipt';
import { Button, Input, App } from 'antd';
import clsx from 'clsx';
import { ethers, formatEther, parseEther, parseUnits } from 'ethers';
import Image from 'next/image';
import { useContext, useMemo, useState } from 'react';

const TransactionCard = ({ record }) => {
  const [currentMode, setCurrentMode] = useState('buy');

  const { user } = useContext(GlobalContext);

  const { bondAddress, address, ticker } = record || {};

  const { message } = App.useApp();

  const isBuyMode = useMemo(() => currentMode === 'buy', [currentMode]);

  const upperSymbol = useMemo(() => ticker?.toUpperCase(), [ticker]);

  const [loading, setLoading] = useState(false);

  const tradeCoin = async (isBuy, amount = 0) => {
    try {
      setLoading(true);
      if (!amount) {
        message.error('Please input amount.');
        return;
      }
      if (!window.ethereum) {
        message.error('Please install MetaMask first.');
        return;
      }
      if (!bondAddress) {
        message.error('Invalid contract address.');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = await provider.getSigner();

      const bondFactory = new ethers.Contract(bondAddress, BOND_ABI, signer);

      let subData;

      if (isBuy) {
        console.log('buybuybuy',bondAddress);
        const tx = await bondFactory.buy({
          value: parseEther(String(amount)),
          gasLimit: 2000000
        });

        const receipt = await tx.wait();

        console.log(receipt);

        const obj = parseReceipt(receipt, bondFactory);

        subData = {
          ...obj,
          hash: receipt.hash,
          userId: user.userId,
          tokenAddress: address
        };

      } else {
        const signerAddress = await signer.getAddress();
        const tokenContract = new ethers.Contract(address, TOKEN_ABI, signer);
        const soldCount = parseEther(String(amount));
        const ttx = await tokenContract.approve(bondAddress, soldCount);
        const tReceipt = await ttx.wait();

        const balance = await tokenContract.balanceOf(signerAddress);
        if (balance < parseEther(String(amount))) {
          message.error('Insufficient balance.');
          return;
        }
        const tx = await bondFactory.sell(parseEther(String(amount)), {
          gasLimit: 2000000
        });

        const receipt = await tx.wait();

        const obj = parseReceipt(receipt, bondFactory);

        subData = {
          ...obj,
          hash: receipt.hash,
          userId: user.userId,
          tokenAddress: address
        };
      }

      if (subData) {
        const res = await createTokenTransaction(subData);
        if (res?.success) {
          message.success('Transaction success!');
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='grid w-full gap-4 md:w-[350px]'
    >
      <div
        className='grid gap-4 rounded-t-lg border border-none bg-[#2e303a] p-4 text-gray-400 transition-all duration-300 ease-in-out md:rounded-lg'
      >
        <div className='flex flex-1 gap-2'>
          <TradeButton
            type='buy'
            isActive={isBuyMode}
            onClick={() => setCurrentMode('buy')}
          >
            buy
          </TradeButton>
          <TradeButton
            type='sell'
            isActive={currentMode === 'sell'}
            onClick={() => setCurrentMode('sell')}
          >
            sell
          </TradeButton>
        </div>
        {
          isBuyMode ? (
            <BuyInfoArea coinType={upperSymbol} onClick={tradeCoin} loading={loading} />
          ) : (
            <SellInfoArea onClick={tradeCoin} coinType={upperSymbol} loading={loading} />
          )
        }
      </div>
    </div>
  )
};

const BuyInfoArea = ({ coinType, onClick, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const [isDefault, setIsDefault] = useState(true);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <Button
          size='small'
          className='text-xs invisible'
          onClick={() => setIsDefault(!isDefault)}
        >
          switch to {isDefault ? coinType : 'OKB'}
        </Button>
      </div>
      <div>
        <Input
          size='large'
          placeholder='0.00'
          value={inputValue}
          onChange={handleInputChange}
          suffix={(
            <div className='flex items-center ml-2 gap-2'>
              <span>
                {isDefault ? 'OKB' : coinType}
              </span>
              <Image
                src={'/okb.png'}
                width={32}
                height={32}
                alt='logo'
                className='w-8 h-8'
                style={{
                  borderRadius: '50%'
                }}
              />
            </div>
          )}
        />
        <div className='mt-2'>
          <Button
            size='small'
            className='text-xs'
            onClick={() => setInputValue(0)}
          >
            reset
          </Button>
        </div>
      </div>
      <div className='flex flex-col'>
        <TradeButton
          isActive
          type='buy'
          allowHover
          onClick={() => onClick(true, inputValue)}
          loading={loading}
        >
          place trade
        </TradeButton>
      </div>
    </div>
  );
};

const SellInfoArea = ({ onClick, coinType, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <Button
          size='small'
          className='text-xs invisible'
        >
          switch to { }
        </Button>
      </div>
      <div>
        <Input
          size='large'
          placeholder='0.00'
          value={inputValue}
          onChange={handleInputChange}
          suffix={(
            <div className='flex items-center ml-2 gap-2'>
              <span>
                {coinType}
              </span>
              <Image
                src={'/okb.png'}
                width={32}
                height={32}
                alt='logo'
                className='w-8 h-8'
                style={{
                  borderRadius: '50%'
                }}
              />
            </div>
          )}
        />
        <div className='mt-2'>
          <Button
            size='small'
            className='text-xs'
            onClick={() => setInputValue(0)}
          >
            reset
          </Button>
        </div>
      </div>
      <div className='flex flex-col'>
        <TradeButton
          isActive
          type='sell'
          allowHover
          onClick={() => onClick(false, inputValue)}
          loading={loading}
        >
          place trade
        </TradeButton>
      </div>
    </div>
  );
};

const TradeButton = ({ children, isActive, type, onClick, allowHover, loading }) => {
  return (
    <button
      className={clsx(
        'flex-1 rounded px-3 py-2 text-center text-base font-normal cursor-pointer',
        {
          'bg-green-400 text-black': isActive && type === 'buy',
          'bg-red-400 text-white': isActive && type === 'sell',
          'hover:bg-red-200': allowHover && type === 'sell',
          'hover:bg-green-200': allowHover && type === 'buy',
          'bg-gray-800 text-gray-600 hover:bg-gray-700 hover:text-gray-500': !isActive,
          'pointer-events-none': loading
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TransactionCard;
