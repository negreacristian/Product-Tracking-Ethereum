import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import contractABI from '../artifacts/contracts/ProGuard.sol/ProGuard.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchProductData } from '../utils/fetchData';
import axios from 'axios';
import pdfIcon from '../assets/image.png';

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
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccounts(accounts);
          const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
          const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
          setContract(contract);
        })
        .catch(() => {
          setMessage('Please install MetaMask!');
        });
    } else {
      setMessage('Please install MetaMask!');
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const jsonProduct = await fetchProductData(serialNumber);

        if (web3 && contract) {
          const blockchainProduct = await contract.methods.getProduct(serialNumber).call();

          setProduct({
            serialNumber,
            name: blockchainProduct[1],
            brand: blockchainProduct[2],
            history: blockchainProduct[3],
            image: jsonProduct.image,
            pdf: jsonProduct.pdf,
            qrCodeUrl: jsonProduct.qrCodeUrl,
          });
        } else {
          setProduct({
            serialNumber,
            image: jsonProduct.image,
            pdf: jsonProduct.pdf,
            qrCodeUrl: jsonProduct.qrCodeUrl,
          });
        }

        setLoading(false);
      } catch (error) {
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
      } catch (error) {
        setMessage('Failed to fetch location');
      }
    };

    fetchLocation();
  }, []);

  const handleVerify = async () => {
    const verifierType = localStorage.getItem('verifierType');

    if (!verifierType || !verifierLocation) {
      setMessage('Invalid verifier role or location');
      return;
    }

    setVerifying(true);

    try {
      await contract.methods.addProductHistory(serialNumber, verifierType, verifierLocation).send({ from: accounts[0] });

      const updatedProduct = await contract.methods.getProduct(serialNumber).call();

      setProduct(prevState => ({
        ...prevState,
        name: updatedProduct[1],
        brand: updatedProduct[2],
        history: updatedProduct[3],
      }));
      setMessage('Product history updated successfully');
    } catch (error) {
      setMessage('Error verifying product');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5">Error: {error.message}</div>;
  if (!product) return <div className="text-center mt-5">No product found</div>;

  const imageUrl = `http://localhost:5000/uploads/${product.image}`;

  return (
    <div>
      <div className="container mt-5 product-page">
        <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="card mx-auto" style={{ maxWidth: '600px', padding: '2rem' }}>
          <div className="card-body d-flex flex-column justify-content-between" style={{ color: '#272727' }}>
            <div className="text-center">
              <div className="product-image-container mb-3">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="img-fluid rounded-circle border"
                  style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:5000/uploads/noimg.jpg'; }}
                />
              </div>
              <h1>{product.name}</h1>
              <p><strong>Serial Number:</strong> {product.serialNumber}</p>
              <p><strong>Brand:</strong> {product.brand}</p>
            </div>
            <div className="d-flex justify-content-center mt-3">
              {role === 'verifier' && (
                <button className="btn btn-success me-3" onClick={handleVerify} disabled={verifying} style={{ backgroundColor: '#457D58', color: '#F6F6E9', fontWeight: 'bold' }}>
                  {verifying ? 'Verifying...' : 'Verify'}
                </button>
              )}
              <button className="btn btn-info" onClick={() => setShowDescription(!showDescription)} style={{ backgroundColor: '#272727', color: '#F6F6E9', fontWeight: 'bold', border: 'none' }}>
                {showDescription ? 'Hide Description' : 'Show Description'}
              </button>
            </div>
            {showDescription && (
              <div className="product-description mt-3" style={{ backgroundColor: '#F5F7F8', color: '#272727', padding: '1rem', borderRadius: '5px' }}>
                <p>{product.description}</p>
                <div className="d-flex justify-content-center align-items-center">
                  {product.qrCodeUrl && (
                    <div className="me-3">
                      <img src={product.qrCodeUrl} alt="QR Code" className="img-fluid" />
                    </div>
                  )}
                  {product.pdf && (
                    <a
                      href={`http://localhost:5000/uploads/${product.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex flex-column align-items-center btn btn-link"
                    >
                      <img src={pdfIcon} alt="PDF Icon" style={{ width: '100px', height: '100px' }} />
                      <span style={{ fontSize: '0.8rem', marginTop: '10px', color: 'red' }}>View PDF</span>
                    </a>
                  )}
                </div>
                <div className="mt-3 text-start">
                  {product.history && product.history.map((entry, index) => (
                    <p key={index}>
                      {index + 1}. {index === 0
                        ? <>The manufacturer <strong>{entry.actor}</strong> sent the product from <strong>{entry.location}</strong></>
                        : <>The product was verified by <strong>{entry.actor}</strong> in <strong>{entry.location}</strong></>}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'} mt-2 text-center`}>{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
