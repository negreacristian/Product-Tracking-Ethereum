// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ProGuard {
    struct Product {
        string serialNumber;
        string name;
        string brand;
        string description;
        string lot;
        string imageUrl;
        string pdfUrl;
    }

    mapping(string => Product) private products;
    event ProductAdded(string serialNumber, string name, string brand, string description, string lot, string imageUrl, string pdfUrl);

    function addProduct(
        string memory serialNumber,
        string memory name,
        string memory brand,
        string memory description,
        string memory lot,
        string memory imageUrl,
        string memory pdfUrl
    ) public {
        Product memory newProduct = Product({
            serialNumber: serialNumber,
            name: name,
            brand: brand,
            description: description,
            lot: lot,
            imageUrl: imageUrl,
            pdfUrl: pdfUrl
        });
        products[serialNumber] = newProduct;
        emit ProductAdded(serialNumber, name, brand, description, lot, imageUrl, pdfUrl);
    }

    function getProduct(string memory serialNumber) public view returns (Product memory) {
        return products[serialNumber];
    }
}
