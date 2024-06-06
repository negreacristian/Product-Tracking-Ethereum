import React, { useState } from 'react';
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

const App = () => {
  const [jwt, setJwt] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    setJwt(null);
    setRole(null);
    localStorage.removeItem('authToken');
  };

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
              <Route path="all-products" element={<AllProducts />} /> {/* Add route for AllProducts */}
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

        <Route path="/product/:serialNumber" element={<Product />} /> {/* New ProductPage Route */}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
