import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div>
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
      <div className="container mt-5">
        <div className="d-flex align-items-center mb-3">
          <div className="mx-auto">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
        <div className="card mx-auto" style={{ maxWidth: '600px', padding: '2rem' }}>
          <div className="card-body d-flex flex-column justify-content-between" style={{ height: '400px', color: '#272727' }}>
            <div className="text-center">
              <h2 className="mt-3" style={{ fontWeight: 'bold' }}>Log In - JWT</h2>
            </div>
            <div className="flex-grow-1"></div>
            <div style={{ marginBottom: '5rem' }}>
              <div className="form-group mb-4">
                <label htmlFor="token">Write your personal Token</label>
                <input
                  type="text"
                  className="form-control"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.5rem' }}
                />
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleLogin}
                  style={{ fontSize: '1rem', padding: '0.5rem 1rem', width: '100%', backgroundColor: '#272727', color: '#F6F6E9', fontWeight: 'bold', border: 'none' }}
                >
                  Log In
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger mt-3 text-center" style={{ fontSize: '1rem', width: '100%' }}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
