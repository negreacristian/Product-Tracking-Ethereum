export const fetchDeployerData = async () => {
  const response = await fetch('/data/deployerData.json');
  if (!response.ok) {
    throw new Error('Failed to fetch deployer data');
  }
  const data = await response.json();
  return data;
};

export const fetchVerifierData = async () => {
  const response = await fetch('/data/verifierData.json');
  if (!response.ok) {
    throw new Error('Failed to fetch verifier data');
  }
  const data = await response.json();
  return data;
};

export const fetchProductData = async (serialNumber) => {
  const response = await fetch(`http://localhost:5000/api/products/${serialNumber}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product data for serial number: ${serialNumber}`);
  }
  const data = await response.json();
  return data;
};

export const fetchAllProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data;
};
