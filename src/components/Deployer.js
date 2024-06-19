import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectMetaMask } from '../utils/metamask';
import { fetchDeployerData } from '../utils/fetchData';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

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

  useEffect(() => {
    const connectedAccount = localStorage.getItem('connectedMetaMaskAccount');
    if (connectedAccount) {
      setAccount(connectedAccount);
    }

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('connectedMetaMaskAccount', accounts[0]);
      } else {
        setAccount(null);
        localStorage.removeItem('connectedMetaMaskAccount');
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleConnectMetaMask = async () => {
    try {
      const connectedAccount = await connectMetaMask();
      setAccount(connectedAccount);
      localStorage.setItem('connectedMetaMaskAccount', connectedAccount);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckProfile = () => {
    const role = 'Producer';
    const { description, userLocation } = deployerData;
    navigate('profile', { state: { account, role, description, userLocation } });
  };

  const handleAddProduct = () => {
    navigate('add-product');
  };

  const handleViewAllProducts = () => {
    navigate('all-products');
  };

  return (
    <div>
      <button
        className="btn btn-outline-secondary back-button"
        onClick={() => navigate('/')}
      >
        <i className="bi bi-arrow-left"></i>
      </button>
    <div className="container mt-5">
      <div className="row">
      
        <div className="col-11 text-center">
          <img src={logo} alt="Logo" className="logo mb-3" />
        </div>
      </div>
      <div className="card">
        <div className="card-body text-center">
          <h1 className="card-title">Producer Page</h1>
          {jwt ? (
            <>
              {account ? (
                <div>
                  <p>Connected account: {account}</p>
                  <div className="d-grid gap-2 d-md-block">
                    <button className="btn btn-info m-2" onClick={handleCheckProfile}>
                      Check Profile
                    </button>
                    <button className="btn btn-success m-2" onClick={handleAddProduct}>
                      Add Product
                    </button>
                    <button className="btn btn-secondary m-2" onClick={handleViewAllProducts}>
                      All Products
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-primary m-2" onClick={handleConnectMetaMask}>
                  Connect to MetaMask
                </button>
              )}
              <button className="btn btn-secondary mt-4" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <p>Please log in as a deployer to connect to MetaMask.</p>
          )}
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Deployer;
