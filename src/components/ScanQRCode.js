import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./Footer";
import CustomQrScanner from './CustomQrScanner';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust the path as needed
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ScanQRCode.css'; // Import custom CSS

const ScanQRCode = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState("No result");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      if (data.startsWith("http://") || data.startsWith("https://")) {
        window.location.href = data;
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error:', err);
  };

  const previewStyle = {
    height: 150, // Smaller size
    width: 150,  // Smaller size
  };

  return (
    <div>
    <div className="container mt-5 text-center">
      <div className="position-relative mb-3">
        <button
          className="btn btn-outline-secondary back-button"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="card-container">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h1 className="card-title">Scan QR Code</h1>
            <div className="mb-3">
              <CustomQrScanner
                delay={100}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
              />
            </div>
            <p className="card-text bg-light p-3 rounded">{result}</p>
          </div>
        </div>
      </div>
     
    </div>
    <Footer></Footer>
    </div>
    
  );
};

export default ScanQRCode;
