import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure you have a logo image in this path
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ handleLogin }) => {
   useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo" style={{ height: '80px' }} />
        </a>
        <div>
          <button className="btn btn-primary" onClick={handleLogin}>Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
