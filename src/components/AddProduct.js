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
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
      setActor(profile.role);
      setLocation(profile.location);
    }

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
        .catch(error => {
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
    setMessage('');
    setAdding(true);

    const formData = new FormData();
    formData.append('serialNumber', serialNumber);
    if (productImage) {
      formData.append('image', productImage);
    }
    if (productPdf) {
      formData.append('pdf', productPdf);
    }

    try {
      if (web3 && contract && accounts.length > 0) {
        contract.methods.registerProduct(
          productName,
          productBrand,
          serialNumber,
          actor,
          location
        ).send({ from: accounts[0] })
          .on('receipt', async (receipt) => {
            try {
              const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: formData,
              });

              const result = await response.json();

              if (response.ok) {
                setMessage('Product added successfully');
                setQrCodeValue(`http://localhost:3000/product/${serialNumber}`);
                setSerialNumber('');
                setProductName('');
                setProductBrand('');
                setProductImage(null);
                setProductPdf(null);
              } else {
                setMessage(`Failed to add product: ${result.message}`);
              }
            } catch (error) {
              setMessage('Error occurred while adding product to local server');
            } finally {
              setAdding(false);
            }
          })
          .on('error', (error) => {
            if (error.code === 4001) {
              setMessage('Transaction rejected by user.');
            } else {
              setMessage('Error occurred while adding product to blockchain');
            }
            setAdding(false);
          });
      } else {
        setMessage('Web3, contract, or accounts not loaded');
        setAdding(false);
      }
    } catch (error) {
      setMessage('Error occurred while adding product');
      setAdding(false);
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
        <div className="card mx-auto" style={{ maxWidth: '600px', padding: '2rem', height: 'auto' }}>
          <div className="card-body" style={{ height: '100%' }}>
            <h1 className="card-title" style={{ fontWeight: 'bold', textAlign: 'center' }}>Add Product</h1>
            {message && (
              <div className={`alert ${message.toLowerCase().includes('error') || message.toLowerCase().includes('rejected') ? 'alert-danger' : 'alert-info'}`} style={{ marginTop: '1rem' }}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div className="form-group mb-3">
                <label>Serial Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Product Brand</label>
                <input
                  type="text"
                  className="form-control"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Product Image (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
              <div className="form-group mb-3">
                <label>Product PDF (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handlePdfChange}
                  accept="application/pdf"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#272727', color: '#F6F6E9', fontWeight: 'bold', border: 'none', width: '100%' }}>
                {adding ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
