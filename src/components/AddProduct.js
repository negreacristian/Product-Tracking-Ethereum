import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddProduct.css';
import Web3 from 'web3';
import contractABI from '../artifacts/contracts/ProGuard.sol/ProGuard.json';

const AddProduct = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productPdf, setProductPdf] = useState(null);
  const [message, setMessage] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [actor, setActor] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve actor and location from localStorage
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
      setActor(profile.role);  // Assuming actor is the role
      setLocation(profile.location);
    }

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccounts(accounts);
          const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with the actual address
          const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
          setContract(contract);
          console.log('Web3, accounts, and contract initialized:', { web3, accounts, contract });
        })
        .catch(error => {
          console.error('Error initializing Web3, accounts, or contract:', error);
          setMessage('Error initializing Web3, accounts, or contract');
        });
    } else {
      setMessage('Please install MetaMask!');
    }
  }, []);

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setProductPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    const formData = new FormData();
    formData.append('serialNumber', serialNumber);
    if (productImage) {
      formData.append('image', productImage);
    }
    if (productPdf) {
      formData.append('pdf', productPdf);
    }

    try {
      // Interact with the blockchain
      if (web3 && contract && accounts.length > 0) {
        console.log('Attempting to register product on blockchain:', {
          productName,
          productBrand,
          serialNumber,
          actor,
          location,
          from: accounts[0]
        });

        contract.methods.registerProduct(
          productName,
          productBrand,
          serialNumber,
          actor,
          location
        ).send({ from: accounts[0] })
          .on('receipt', async (receipt) => {
            console.log('Blockchain transaction receipt:', receipt);

            // Blockchain transaction was successful
            try {
              const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: formData,
              });

              const result = await response.json();

              if (response.ok) {
                setMessage('Product added successfully');
                setQrCodeValue(`http://localhost:3000/product/${serialNumber}`);

                // Optionally, clear the form
                setSerialNumber('');
                setProductName('');
                setProductBrand('');
                setProductImage(null);
                setProductPdf(null);
              } else {
                console.error('Failed to add product to local server:', result.message);
                setMessage(`Failed to add product: ${result.message}`);
              }
            } catch (error) {
              console.error('Error occurred while adding product to local server:', error);
              setMessage('Error occurred while adding product to local server');
            }
          })
          .on('error', (error) => {
            console.error('Error occurred while adding product to blockchain:', error);
            setMessage('Error occurred while adding product to blockchain');
          });
      } else {
        setMessage('Web3, contract, or accounts not loaded');
      }
    } catch (error) {
      console.error('Error occurred while adding product:', error);
      setMessage('Error occurred while adding product');
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>

      {qrCodeValue ? (
        <div className="card mt-5">
          <div className="card-body">
            <h2>{message}</h2>
            <div className="qr-code">
              <QRCode value={qrCodeValue} size={256} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <h1 className="card-title">Add Product</h1>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Serial Number</label>
              <input
                type="text"
                className="form-control"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Brand</label>
              <input
                type="text"
                className="form-control"
                value={productBrand}
                onChange={(e) => setProductBrand(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Image (optional)</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="form-group">
              <label>Product PDF (optional)</label>
              <input
                type="file"
                className="form-control"
                onChange={handlePdfChange}
                accept="application/pdf"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
