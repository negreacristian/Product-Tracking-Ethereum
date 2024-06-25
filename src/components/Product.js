import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import contractABI from '../artifacts/contracts/ProGuard.sol/ProGuard.json';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { fetchProductData } from '../utils/fetchData';
import axios from 'axios';

const Product = ({ jwt, role }) => {
  const { serialNumber } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [verifierLocation, setVerifierLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccounts(accounts);
          const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with the actual address
          const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
          setContract(contract);
        })
        .catch(error => {
          setMessage('Please install MetaMask!');
        });
    } else {
      setMessage('Please install MetaMask!');
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product data from the backend
        const jsonProduct = await fetchProductData(serialNumber);

        if (web3 && contract) {
          // Fetch product data from the blockchain
          const blockchainProduct = await contract.methods.getProduct(serialNumber).call();
          setProduct({ ...jsonProduct, blockchainData: blockchainProduct });
        } else {
          setProduct(jsonProduct);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [serialNumber, web3, contract]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        setVerifierLocation(response.data.city);
        console.log('Fetched Location:', response.data.city); // Debugging log
      } catch (error) {
        console.error('Error fetching location:', error);
        setMessage('Failed to fetch location');
      }
    };

    fetchLocation();
  }, []);

  const handleVerify = async () => {
    const verifierType = localStorage.getItem('verifierType'); // Retrieve verifier type from local storage

    console.log('Verifier Type:', verifierType); // Debugging log
    console.log('Verifier Location:', verifierLocation); // Debugging log

    if (!verifierType || !verifierLocation) {
      console.error('Invalid verifier role or location');
      setMessage('Invalid verifier role or location');
      return;
    }

    try {
      await contract.methods.addProductHistory(serialNumber, verifierType, verifierLocation)
        .send({ from: accounts[0] });

      // Fetch the updated product data
      const updatedProduct = await contract.methods.getProduct(serialNumber).call();
      setProduct(prevState => ({
        ...prevState,
        blockchainData: updatedProduct
      }));
      setMessage('Product history updated successfully');
    } catch (error) {
      console.error('Error verifying product:', error);
      setMessage('Error verifying product');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center mt-5">No product found</div>;
  }

  const imageUrl = `http://localhost:5000/uploads/${product.image}`;

  return (
    <div>
      <div className="container mt-5 product-page">
        <button className="btn btn-outline-secondary me-auto" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="product-image-container mb-3">
              <img
                src={imageUrl}
                alt={product.name}
                className="img-fluid rounded-circle border"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:5000/uploads/noimg.jpg'; }} // Add a fallback image in case of error
              />
            </div>
            <h1>{product.name}</h1>
            {product.blockchainData && (
              <>
                <p><strong>Deployer:</strong> {product.blockchainData[0]}</p>
                {product.blockchainData[3] && product.blockchainData[3].map((entry, index) => (
                  <p key={index}><strong>{entry.actor}:</strong> {entry.location}</p>
                ))}
              </>
            )}
            <button className="btn btn-primary mt-3" onClick={() => setShowDescription(!showDescription)}>
              {showDescription ? 'Hide Description' : 'Show Description'}
            </button>
            {showDescription && (
              <div className="product-description mt-3">
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Lot:</strong> {product.lot}</p>
                <p>{product.description}</p>
                {product.qrCodeUrl && (
                  <div className="mt-3">
                    <img src={product.qrCodeUrl} alt="QR Code" className="img-fluid" />
                  </div>
                )}
              </div>
            )}
            {product.pdf && (
              <a
                href={`http://localhost:5000/uploads/${product.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-link mt-3"
              >
                View PDF
              </a>
            )}
            {role === 'verifier' && (
              <button className="btn btn-success mt-3" onClick={handleVerify}>
                Verify
              </button>
            )}
            {message && <div className="alert alert-info mt-2">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
