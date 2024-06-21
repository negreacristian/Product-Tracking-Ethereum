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
  const [productDescription, setProductDescription] = useState('');
  const [productLot, setProductLot] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productPdf, setProductPdf] = useState(null);
  const [message, setMessage] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
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

    const formData = new FormData();
    formData.append('serialNumber', serialNumber);
    formData.append('name', productName);
    formData.append('brand', productBrand);
    formData.append('description', productDescription);
    formData.append('lot', productLot);
    if (productImage) {
      formData.append('image', productImage);
    }
    if (productPdf) {
      formData.append('pdf', productPdf);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Interact with the blockchain
        if (web3 && contract && accounts.length > 0) {
          const imageUrl = productImage ? URL.createObjectURL(productImage) : '';
          const pdfUrl = productPdf ? URL.createObjectURL(productPdf) : '';

          contract.methods.addProduct(
            serialNumber,
            productName,
            productBrand,
            productDescription,
            productLot,
            imageUrl,
            pdfUrl
          ).send({ from: accounts[0] })
            .on('receipt', function(receipt) {
              setMessage('Product added successfully');
              setQrCodeValue(`http://localhost:3000/product/${serialNumber}`);

              // Optionally, clear the form
              setSerialNumber('');
              setProductName('');
              setProductBrand('');
              setProductDescription('');
              setProductLot('');
              setProductImage(null);
              setProductPdf(null);
            })
            .on('error', function(error) {
              console.error('Error occurred while adding product:', error);
              setMessage('Error occurred while adding product');
            });
        } else {
          setMessage('Web3, contract, or accounts not loaded');
        }
      } else {
        console.error('Failed to add product:', result.message);
        setMessage(`Failed to add product: ${result.message}`);
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
              <label>Product Description</label>
              <textarea
                className="form-control"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Lot</label>
              <input
                type="text"
                className="form-control"
                value={productLot}
                onChange={(e) => setProductLot(e.target.value)}
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
