import { ethers  } from 'ethers';

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts;
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
    }
  } else {
    alert('Please Instll OKX or MetaMask!');
  }
};

export const checkWalletConnection = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_accounts', []);
      // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        console.log('Wallet is connected:', accounts);
        return accounts;
      } else {
        console.log('No wallet connected');
        return null;
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  } else {
    alert('Please Install OKX or MetaMask!');
  }
};