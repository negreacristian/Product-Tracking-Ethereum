import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectMetaMask } from '../utils/metamask';
import axios from 'axios';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const Verifier = ({ jwt, handleLogout }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleCheckProfile = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      navigate('profile', { state: { account, role: 'Verifier', userLocation: response.data.city } });
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Failed to fetch location.');
    }
  };

  const handleVerifyProduct = () => {
    navigate('/scan'); // Redirect to the QR scanner page
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
      <div className="card mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body text-center">
          <h1 className="card-title">Verifier Page</h1>
          {jwt ? (
            <>
              {account ? (
                <div>
                  <p>Connected account: {account}</p>
                  <button className="btn btn-info m-2" onClick={handleCheckProfile}>
                    Check Profile
                  </button>
                  <button className="btn btn-warning m-2" onClick={handleVerifyProduct}>
                    Verify Product
                  </button>
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
            <p>Please log in as a verifier to connect to MetaMask.</p>
          )}
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Verifier;
