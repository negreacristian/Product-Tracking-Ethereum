import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Content = ({ error }) => {
  const navigate = useNavigate();

  const navigateToScan = () => {
    navigate("/scan");
  };


  return (
    <div className='cont_container'>
    <div className="container text-center mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <h1 className="display-4">Securely Authenticate Your Products with PROduct Guard</h1>
      <p className="lead mt-4">Our blockchain-based product identification system provides a secure and reliable way to authenticate your products and protect against fraud.</p>
  
      <button className="btn btn-primary btn-lg mt-4" onClick={navigateToScan}>Scan QR Code</button>
    </div>
    </div>
    
  );
};

export default Content;
