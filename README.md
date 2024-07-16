# PROduct Guard

A decentralized application for product tracking using blockchain technology. This application allows users to add, verify, and view products securely and transparently.

## Features

- **Add Product**: Deployer can add new products with images and PDFs.
- **Verify Product**: Verifier can verify the authenticity of products.
- **Backend**: REST API for product management.
- **Authentication**: JWT for secure access to REST API.
- **Scan QR Code**: Users can scan QR codes to view product details.
## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine.
- MetaMask extension installed on your browser.
- Local Ethereum blockchain running or Hardhat installed.

## Installation

1. **Clone the Repository**

   git clone https://github.com/negreacristian/Product-Tracking-Ethereum
   cd proiect/product-tracking-dapp

2. **Install Server Dependencies**
   
   node -v
   npm -v
   npm install
   npm install -g hardhat
  
3. **Update the SECRET_KEY in server/server.js with a secure key for JWT signing.**

3. **START DAPP**

    Run local blockchain:  $npx hardhat node

    Deploy Smart Contract: $npx hardhat run scripts/deploy.js --network localhost

    Start server: $cd src/backend
                  $node server.js

    Start client: $cd src
                  $npm start
