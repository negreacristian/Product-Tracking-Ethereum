import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductData } from '../utils/fetchData';
import './Product.css';

const Product = () => {
  const { serialNumber } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await fetchProductData(serialNumber);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [serialNumber]);

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
    <div className="container mt-5 product-page">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="product-image-container mb-3">
            <img
              src={imageUrl}
              alt={product.name}
              className="product-image rounded-circle"
              onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:5000/uploads/noimg.jpg'; }} // Add a fallback image in case of error
            />
          </div>
          <h1>{product.name}</h1>
          <p><strong>Deployer:</strong> The product was sent</p>
          <p><strong>Verifier 1:</strong> Not verified yet</p>
          <p><strong>Verifier 2:</strong> Not verified yet</p>
          <button className="btn btn-primary mt-3" onClick={() => setShowDescription(!showDescription)}>
            {showDescription ? 'Hide Description' : 'Show Description'}
          </button>
          {showDescription && (
            <div className="product-description mt-3">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Lot:</strong> {product.lot}</p>
              <p>{product.description}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Product;
