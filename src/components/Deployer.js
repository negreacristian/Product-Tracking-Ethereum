import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectMetaMask } from '../utils/metamask';
import { fetchDeployerData } from '../utils/fetchData';

const Deployer = ({ jwt, handleLogout }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [deployerData, setDeployerData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDeployerData();
        setDeployerData(data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const handleConnectMetaMask = async () => {
    try {
      const connectedAccount = await connectMetaMask();
      setAccount(connectedAccount);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckProfile = () => {
    navigate('profile', { state: { ...deployerData, account, role: 'Deployer' } });
  };

  const handleAddProduct = () => {
    navigate('add-product');
  };

  const handleViewAllProducts = () => {
    navigate('all-products');
  };

  return (
    <div className="container mt-5">
      <h1>Deployer Page</h1>
      {jwt ? (
        <>
          {account ? (
            <div>
              <p>Connected account: {account}</p>
              <button className="btn btn-info" onClick={handleCheckProfile}>
                Check Profile
              </button>
              <button className="btn btn-success ml-2" onClick={handleAddProduct}>
                Add Product
              </button>
              <button className="btn btn-secondary ml-2" onClick={handleViewAllProducts}>
                All Products
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleConnectMetaMask}>
              Connect to MetaMask
            </button>
          )}
          <button className="btn btn-secondary mt-3" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>Please log in as a deployer to connect to MetaMask.</p>
      )}
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
};

export default Deployer;
