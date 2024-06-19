import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; 
import logo from '../assets/logo.png';

const Login = ({ setJwt, setRole }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { token });
      const { jwtToken } = response.data;
      const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
      setJwt(jwtToken);
      setRole(decodedToken.role);

      // Store the token and verifier type in localStorage
      localStorage.setItem('authToken', jwtToken);
      localStorage.setItem('userRole', decodedToken.role);
      if (decodedToken.verifierType) {
        localStorage.setItem('verifierType', decodedToken.verifierType);
      }

      if (decodedToken.role === 'deployer') {
        navigate('/deployer');
      } else if (decodedToken.role === 'verifier') {
        navigate('/verifier');
      }
    } catch (err) {
      setError('Invalid token. Please contact the admins to get permission.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-outline-secondary me-auto" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="mx-auto">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>
      <div className="card mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h2 className="mt-3 text-center">Log In</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label htmlFor="token">Token</label>
            <input
              type="text"
              className="form-control"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-3 w-100" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
