import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectMetaMask } from '../utils/metamask';
import logo from '../assets/logo.png';
import metamaskLogo from '../assets/meta.png'; // Add the MetaMask logo
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Deployer = ({ jwt, handleLogout }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false); // State for connecting
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const profile = {
          account,
          role: 'Producer',
          location: response.data.city,
        };
        localStorage.setItem('profile', JSON.stringify(profile));
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (account) {
      fetchLocation();
    }
  }, [account]);

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
      setConnecting(true); // Set connecting state to true
      const connectedAccount = await connectMetaMask();
      setAccount(connectedAccount);
      localStorage.setItem('connectedMetaMaskAccount', connectedAccount);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false); // Set connecting state to false
    }
  };

  const handleCheckProfile = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
      navigate('profile', { state: profile });
    } else {
      setError('Profile not available.');
    }
  };

  const handleAddProduct = () => {
    navigate('add-product');
  };

  const handleViewAllProducts = () => {
    navigate('all-products');
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
      <div className="position-relative mb-3">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="card mx-auto" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div className="card-body d-flex flex-column justify-content-between" style={{ height: '500px', color: '#272727' }}>
        <div className="text-center">
        <h1 className="card-title" style={{ fontWeight: 'bold' }}>Producer Page</h1>
        <p style={{ fontWeight: 'bold' }}>Connected account:</p> {account && <p>{account}</p>}
      </div>
        
          <div className="flex-grow-1"></div>
          {jwt ? (
            <>
              <div>
                {account ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-info" onClick={handleCheckProfile} style={{ fontSize: '1rem', padding: '0.5rem 1rem', width: '30%', backgroundColor: '#272727', color: '#F6F6E9', fontWeight: 'bold', border: 'none' }}>
                        Check Profile
                      </button>
                      <button className="btn btn-success" onClick={handleAddProduct} style={{ fontSize: '1rem', padding: '0.5rem 1rem', width: '30%', backgroundColor: '#272727', color: '#F6F6E9', fontWeight: 'bold', border: 'none' }}>
                        Add Product
                      </button>
                      <button className="btn btn-secondary" onClick={handleViewAllProducts} style={{ fontSize: '1rem', padding: '0.5rem 1rem', width: '30%', backgroundColor: '#272727', color: '#F6F6E9', fontWeight: 'bold', border: 'none' }}>
                        All Products
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    {connecting && <img src={metamaskLogo} alt="MetaMask Logo" style={{ width: '150px', marginBottom: '3rem' }} />}
                    <button className="btn btn-primary mt-3" onClick={handleConnectMetaMask} style={{ fontSize: '1rem', padding: '0.5rem 1rem', width: '100%', backgroundColor: '#272727', color: '#F6851B', fontWeight: 'bold', border: 'none' }}>
                      Connect to MetaMask
                    </button>
                  </div>
                )}
                <button className="btn btn-secondary mt-3" onClick={handleLogout} style={{ fontSize: '1rem', padding: '0.5rem 1rem', width: '100%', backgroundColor: '#C40C0C', color: '#FFFFFF', fontWeight: 'bold', border: 'none' }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <p>Please log in as a deployer to connect to MetaMask.</p>
          )}
          {error && <div className="alert alert-danger mt-3 text-center" style={{ fontSize: '1rem', width: '100%' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Deployer;
