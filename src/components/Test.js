import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../artifacts/contracts/ProGuard.sol/ProGuard.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ProGuard = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [actor, setActor] = useState('');
  const [location, setLocation] = useState('');
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
        setContract(contract);
      } else {
        alert('Please install MetaMask!');
      }
    };

    loadWeb3();
  }, []);

  const registerProduct = async () => {
    if (contract) {
      await contract.methods.registerProduct(name, brand, serialNumber, actor, location).send({ from: account });
      alert('Product registered!');
    }
  };

  const addProductHistory = async () => {
    if (contract) {
      await contract.methods.addProductHistory(serialNumber, actor, location).send({ from: account });
      alert('Product history added!');
    }
  };

  const getProduct = async () => {
    if (contract) {
      try {
        const result = await contract.methods.getProduct(serialNumber).call();
        const serial = result[0];
        const productName = result[1];
        const productBrand = result[2];
        const history = result[3];

        // Parsing the history array properly
        const parsedHistory = history.map(item => ({
          id: item.id,
          actor: item.actor,
          location: item.location
        }));

        setProductInfo({
          serial,
          productName,
          productBrand,
          history: parsedHistory,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error fetching product data. Please check the console for details.');
      }
    }
  };

  return (
    <div className="container">
      <h1>ProGuard Product Registry</h1>
      <div>
        <h2>Register Product</h2>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Serial Number:</label>
          <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Actor:</label>
          <input type="text" value={actor} onChange={(e) => setActor(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <button onClick={registerProduct}>Register Product</button>
      </div>

      <div>
        <h2>Add Product History</h2>
        <div className="form-group">
          <label>Serial Number:</label>
          <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Actor:</label>
          <input type="text" value={actor} onChange={(e) => setActor(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <button onClick={addProductHistory}>Add Product History</button>
      </div>

      <div>
        <h2>Get Product Info</h2>
        <div className="form-group">
          <label>Serial Number:</label>
          <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
        </div>
        <button onClick={getProduct}>Get Product</button>
        {productInfo && (
          <div>
            <h3>Product Info</h3>
            <p>Serial Number: {productInfo.serial}</p>
            <p>Name: {productInfo.productName}</p>
            <p>Brand: {productInfo.productBrand}</p>
            <h4>History:</h4>
            {productInfo.history.map((entry, index) => (
              <div key={index} className="history-item">
                <p>Actor: {entry.actor}</p>
                <p>Location: {entry.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProGuard;
