import React from 'react';
import logo from '../assets/logo.png'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ handleLogin }) => {
  const headerStyles = {
    backgroundColor: '#457D58',
    color: '#457D58',
  };

  const buttonStyles = {
    backgroundColor: '#272727',
    color: '#457D58',
    fontSize: '1.2rem',
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  };

  return (
    <nav className="navbar navbar-expand-lg" style={headerStyles}>
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo" style={{ height: '80px' }} />
        </a>
        <div>
          <button className="btn" style={buttonStyles} onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
