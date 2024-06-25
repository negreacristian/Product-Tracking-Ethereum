export const connectMetaMask = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      throw new Error('MetaMask connection failed');
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};
