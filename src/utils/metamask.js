// src/utils/metamask.js
import detectEthereumProvider from '@metamask/detect-provider';

export const connectMetaMask = async () => {
  const provider = await detectEthereumProvider();

  if (provider) {
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      return accounts[0]; // return the first account
    } catch (error) {
      console.error('User denied account access');
      throw new Error('User denied account access');
    }
  } else {
    console.error('Please install MetaMask!');
    throw new Error('Please install MetaMask');
  }
};
