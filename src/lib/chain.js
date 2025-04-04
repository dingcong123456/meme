import { CHAIN_ID, CHAIN_NAME, RPC_URLS } from '@/util/coin/constant';
import { ethers } from 'ethers';

export const connectChain = async (config) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      ...config
    }),
  }
  try {
    const response = await fetch(process.env.CHAIN_HOST, options);
    const contentType = response.headers.get('content-type');

    const status = response.status;
    let result;
    if (contentType.includes('application/json')) {
      result = await response.json();
    } else if (contentType.includes('text/')) {
      result = await response.text();
    } else {
      throw new Error('Unsupported content type: ' + contentType);
    }
    if ([400, 500].includes(status)) {
      throw result;
    }
    return result;
  } catch (error) {
    console.error('Fetch request failed:', error);
    throw error;
  }
}

export const checkChain = async () => {
  if (!window.ethereum) {
    alert('No ethereum provider found');
    return false;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  console.log('network:', network);

  if (network.chainId !== parseInt(CHAIN_ID, 16)) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID }]
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: CHAIN_ID,
              chainName: CHAIN_NAME,
              nativeCurrency: {
                name: 'OKB',
                symbol: 'OKB',
                decimals: 18
              },
              rpcUrls: RPC_URLS
            }]
          });
          console.log('chain added');
        } catch (err) {
          console.error('chain add failed:', err);
          return false;
        }
      } else {
        alert(`Please switch to ${CHAIN_NAME} network`);
        return false;
      }
    }
  }

  return provider;
};