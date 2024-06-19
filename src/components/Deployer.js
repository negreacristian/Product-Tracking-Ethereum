import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectMetaMask } from '../utils/metamask';
import { fetchDeployerData, fetchAllProducts } from '../utils/fetchData';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Deployer = ({ jwt, handleLogout }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [deployerData, setDeployerData] = useState({});
  const [products, setProducts] = useState([]);
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
    const getProducts = async () => {
      try {
        const products = await fetchAllProducts();
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    getProducts();
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
    <div className="container mt-5">
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
      <div className="position-relative mb-3">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="card">
        <div className="card-body text-center">
          <h1 className="card-title">Producer Page</h1>
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
      </div>
      <div className="mt-5">
        <h2>All Products</h2>
        {products.length > 0 ? (
          <ul className="list-group">
            {products.map((product) => (
              <li key={product.serialNumber} className="list-group-item">
                {product.name} - {product.serialNumber}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Deployer;
