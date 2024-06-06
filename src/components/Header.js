import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure you have a logo image in this path
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({  handleLogin }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            { (
              <button className="btn btn-primary" onClick={handleLogin}>Log In</button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
