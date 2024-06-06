import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const AddProduct = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productLot, setProductLot] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productPdf, setProductPdf] = useState(null);
  const [message, setMessage] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setProductPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('serialNumber', serialNumber);
    formData.append('name', productName);
    formData.append('brand', productBrand);
    formData.append('description', productDescription);
    formData.append('lot', productLot);
    if (productImage) {
      formData.append('image', productImage);
    }
    if (productPdf) {
      formData.append('pdf', productPdf);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Product added successfully');
        setQrCodeValue(`http://localhost:3000/product/${serialNumber}`);
        // Optionally, clear the form
        setSerialNumber('');
        setProductName('');
        setProductBrand('');
        setProductDescription('');
        setProductLot('');
        setProductImage(null);
        setProductPdf(null);
      } else {
        setMessage(`Failed to add product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error occurred while adding product');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add Product</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Serial Number</label>
          <input
            type="text"
            className="form-control"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Brand</label>
          <input
            type="text"
            className="form-control"
            value={productBrand}
            onChange={(e) => setProductBrand(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Description</label>
          <textarea
            className="form-control"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Lot</label>
          <input
            type="text"
            className="form-control"
            value={productLot}
            onChange={(e) => setProductLot(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Image (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label>Product PDF (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handlePdfChange}
            accept="application/pdf"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Product
        </button>
      </form>
      {qrCodeValue && (
        <div>
          <h2>Scan this QR code to access the product page:</h2>
          <QRCode value={qrCodeValue} />
        </div>
      )}
    </div>
  );
};

export default AddProduct;
