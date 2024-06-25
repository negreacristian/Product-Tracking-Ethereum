const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SECRET_KEY = 'Lucrare_Licenta<>2024-Negrea*Cristian'; // Use a secure key in production
const validTokens = {
  deployerToken123: { role: 'deployer' },
  verifierToken1: { role: 'verifier', verifierType: 'verifier1' },
  verifierToken2: { role: 'verifier', verifierType: 'verifier2' }
};

app.post('/login', (req, res) => {
  const { token } = req.body;

  if (validTokens[token]) {
    const userRole = validTokens[token].role;
    const verifierType = validTokens[token].verifierType;
    const jwtToken = jwt.sign({ role: userRole, verifierType }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ jwtToken });
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    return res.json({ message: 'Protected content', user });
  });
});

// Set up storage for Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Ensure the products.json file exists
const productsFilePath = path.resolve(__dirname, 'products.json');
if (!fs.existsSync(productsFilePath)) {
  fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
  console.log(`Created file: ${productsFilePath}`);
} else {
  console.log(`File already exists: ${productsFilePath}`);
}

// Function to save product data to JSON file
const saveProductData = (data) => {
  fs.readFile(productsFilePath, (err, fileData) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fileData);
    } catch (parseErr) {
      console.error('Error parsing JSON file:', parseErr);
      return;
    }

    jsonData.push(data);
    fs.writeFile(productsFilePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
      } else {
        console.log('Updated products.json file with new product data');
      }
    });
  });
};

// Endpoint to add a new product
app.post('/api/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
  try {
    const { serialNumber } = req.body;
    const image = req.files && req.files['image'] ? req.files['image'][0].filename : null;
    const pdf = req.files && req.files['pdf'] ? req.files['pdf'][0].filename : null;
    const productUrl = `http://localhost:3000/product/${serialNumber}`;
    
    // Generate QR code URL
    QRCode.toDataURL(productUrl, (err, qrCodeUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).json({ message: 'Error generating QR code' });
      }

      const product = {
        serialNumber,
        image,
        pdf,
        qrCodeUrl
      };

      console.log('Product received:', product);

      // Save the product data to a JSON file
      saveProductData(product);

      res.status(200).json({ message: 'Product added successfully' });
    });
  } catch (error) {
    console.error('Error occurred while adding product:', error);
    res.status(500).json({ message: 'Error occurred while adding product', error: error.message });
  }
});


// Endpoint to fetch a product by serial number
app.get('/api/products/:serialNumber', (req, res) => {
  const { serialNumber } = req.params;
  const productsFilePath = path.resolve(__dirname, 'products.json');

  fs.readFile(productsFilePath, (err, fileData) => {
    if (err) {
      console.error('Error reading product data:', err);
      return res.status(500).json({ message: 'Error reading product data' });
    }

    const products = JSON.parse(fileData);
    const product = products.find(p => p.serialNumber === serialNumber);

    if (!product) {
      console.error('Product not found for serial number:', serialNumber);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product found:', product);
    res.json(product);
  });
});

// Endpoint to fetch all products
app.get('/api/products', (req, res) => {
  const productsFilePath = path.resolve(__dirname, 'products.json');

  fs.readFile(productsFilePath, (err, fileData) => {
    if (err) {
      console.error('Error reading product data:', err);
      return res.status(500).json({ message: 'Error reading product data' });
    }

    const products = JSON.parse(fileData);
    res.json(products);
  });
});

// Endpoint to update the verification status of a product
app.put('/api/products/:serialNumber/verify', (req, res) => {
  const { serialNumber } = req.params;
  const { verifier, status } = req.body;
  const productsFilePath = path.resolve(__dirname, 'products.json');

  fs.readFile(productsFilePath, (err, fileData) => {
    if (err) {
      console.error('Error reading product data:', err);
      return res.status(500).json({ message: 'Error reading product data' });
    }

    const products = JSON.parse(fileData);
    const product = products.find(p => p.serialNumber === serialNumber);

    if (!product) {
      console.error('Product not found for serial number:', serialNumber);
      return res.status(404).json({ message: 'Product not found' });
    }

    if (verifier === 'verifier1') {
      product.verifier1Status = status;
    } else if (verifier === 'verifier2') {
      product.verifier2Status = status;
    } else {
      return res.status(400).json({ message: 'Invalid verifier' });
    }

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return res.status(500).json({ message: 'Error updating product data' });
      } else {
        console.log('Updated verification status for product', serialNumber);
        res.status(200).json({ message: 'Verification status updated' });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
