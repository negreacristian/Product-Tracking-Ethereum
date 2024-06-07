import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ScanQRCode from './components/ScanQRCode';
import Deployer from './components/Deployer';
import Verifier from './components/Verifier';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import AddProduct from './components/AddProduct';
import Product from './components/Product';
import AllProducts from './components/AllProducts';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import axios from 'axios';

const App = () => {
  const [jwt, setJwt] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setJwt(token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setRole(decodedToken.role);
    }
    setLoading(false); // Set loading to false after checking the token
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (jwt) {
        axios.post('http://localhost:5000/refresh-token', {}, {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        })
        .then(response => {
          const { jwtToken } = response.data;
          localStorage.setItem('authToken', jwtToken);
          setJwt(jwtToken);
        })
        .catch(error => console.error('Error refreshing token:', error));
      }
    }, 4 * 60 * 1000); // Refresh token every 4 minutes

    return () => clearInterval(interval);
  }, [jwt]);

  const handleLogout = () => {
    setJwt(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('connectedMetaMaskAccount'); // Clear MetaMask connection status
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking the token
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home jwt={jwt} />} />
        <Route path="/login" element={<Login setJwt={setJwt} setRole={setRole} />} />
        <Route path="/scan" element={<ScanQRCode />} />

        <Route path="/deployer/*" element={
          <PrivateRoute jwt={jwt} role={role} requiredRole="deployer">
            <Routes>
              <Route path="/" element={<Deployer jwt={jwt} handleLogout={handleLogout} />} />
              <Route path="profile" element={<Profile role="Deployer" />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="all-products" element={<AllProducts />} />
            </Routes>
          </PrivateRoute>
        } />

        <Route path="/verifier/*" element={
          <PrivateRoute jwt={jwt} role={role} requiredRole="verifier">
            <Routes>
              <Route path="/" element={<Verifier jwt={jwt} handleLogout={handleLogout} />} />
              <Route path="profile" element={<Profile role="Verifier" />} />
            </Routes>
          </PrivateRoute>
        } />

        <Route path="/product/:serialNumber" element={<Product />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
