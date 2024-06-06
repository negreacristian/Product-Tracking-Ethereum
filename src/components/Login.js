import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Import custom CSS for styling

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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mt-5">Log In</h2>
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
          <button className="btn btn-primary mt-3" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
