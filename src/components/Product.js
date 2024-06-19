import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { useNavigate } from 'react-router-dom';

const Product = ({ jwt, role }) => {
  const { serialNumber } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${serialNumber}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [serialNumber]);

  const handleVerify = async () => {
    const verifierType = localStorage.getItem('verifierType'); // Retrieve verifier type from local storage

    if (!verifierType) {
      console.error('Invalid verifier role');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${serialNumber}/verify`, { verifier: verifierType, status: 'Verified' });
      setProduct(prevState => ({
        ...prevState,
        [`${verifierType}Status`]: 'Verified'
      }));
    } catch (error) {
      console.error('Error verifying product:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center mt-5">No product found</div>;
  }

  const imageUrl = `http://localhost:5000/uploads/${product.image}`;

  return (
    <div> 
     
    <div className="container mt-5 product-page">
    <button className="btn btn-outline-secondary me-auto" onClick={() => navigate('/')}>
    <i className="bi bi-arrow-left"></i>
  </button>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="product-image-container mb-3">
            <img
              src={imageUrl}
              alt={product.name}
              className="img-fluid rounded-circle border"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:5000/uploads/noimg.jpg'; }} // Add a fallback image in case of error
            />
          </div>
          <h1>{product.name}</h1>
          <p><strong>Deployer:</strong> {product.deployerStatus}</p>
          <p><strong>Verifier 1:</strong> {product.verifier1Status}</p>
          <p><strong>Verifier 2:</strong> {product.verifier2Status}</p>
          <button className="btn btn-primary mt-3" onClick={() => setShowDescription(!showDescription)}>
            {showDescription ? 'Hide Description' : 'Show Description'}
          </button>
          {showDescription && (
            <div className="product-description mt-3">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Lot:</strong> {product.lot}</p>
              <p>{product.description}</p>
              {product.qrCodeUrl && (
                <div className="mt-3">
                  <img src={product.qrCodeUrl} alt="QR Code" className="img-fluid" />
                </div>
              )}
            </div>
          )}
          {product.pdf && (
            <a
              href={`http://localhost:5000/uploads/${product.pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-link mt-3"
            >
              View PDF
            </a>
          )}
          {role === 'verifier' && (
            <button className="btn btn-success mt-3" onClick={handleVerify}>
              Verify
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Product;
