import React, { useEffect, useState } from 'react';
import { fetchAllProducts } from '../utils/fetchData'; // Ensure this function is implemented
import './AllProducts.css'; // Create and style this CSS file as needed
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error: {error.message}</div>;
  }

  return (
    <div className="container mt-5">
            <button
          className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="position-relative mb-3">  
        <img src={logo} alt="Logo" className="logo" />
        </div>
      <h1 className="text-center">All Products</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.serialNumber} className="col-md-4">
            <div className="card mb-4">
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Brand: {product.brand}</p>
                <p className="card-text">Lot: {product.lot}</p>
                <a href={`/product/${product.serialNumber}`} className="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
