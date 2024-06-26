import React, { useEffect, useState } from 'react';
import { fetchAllProducts } from '../utils/fetchData';
import './AllProducts.css';
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
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5">Error: {error.message}</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
      <div className="position-relative mb-3">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1 className="text-center">ALL PRODUCTS</h1>
      <div className="row">
        {products.map((product) => (
          <div
            key={product.serialNumber}
            className="col-md-4"
            onClick={() => navigate(`/product/${product.serialNumber}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card mb-4">
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.serialNumber}
                className="card-img-top"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <h6 className="card-title" style={{ fontSize: '1rem' }}>SN: {product.serialNumber}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
