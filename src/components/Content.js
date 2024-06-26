import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Content = ({ error }) => {
  const navigate = useNavigate();

  const navigateToScan = () => {
    navigate("/scan");
  };

  const buttonStyles = {
    backgroundColor: '#272727',
    color: '#457D58',
    fontSize: '1.2rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  };

  return (
    <div className='cont_container'>
      <div className="container text-center mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <h3 className="display-4">Securely Authenticate Your Products with <span style={{ color: '#457D58' }}>PRO</span>duct Guard</h3>
        <p className="lead mt-4">Our blockchain-based product identification system provides a secure and reliable way to authenticate your products and protect against fraud.</p>
        <button
          className="btn btn-lg mt-4"
          style={buttonStyles}
          onClick={navigateToScan}
        >
          Scan QR Code
        </button>
      </div>
    </div>
  );
};

export default Content;
