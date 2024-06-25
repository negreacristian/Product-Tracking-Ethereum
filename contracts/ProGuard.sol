// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract ProGuard {

    struct Product {
        string name;
        string serialNumber;
        string brand;
        mapping(uint => ProductHistory) history;
        uint historySize;
    }

    struct ProductHistory {
        uint id;
        string actor;
        string location;
    }

    mapping(string => Product) private products;

    function registerProduct(
        string memory _name, 
        string memory _brand, 
        string memory _serialNumber, 
        string memory _actor, 
        string memory _location
    ) 
        public 
    {
        Product storage p = products[_serialNumber];

        p.name = _name;
        p.brand = _brand;
        p.serialNumber = _serialNumber;
        p.historySize = 0;

        addProductHistory(_serialNumber, _actor, _location);
    }

    function addProductHistory(
        string memory _serialNumber, 
        string memory _actor, 
        string memory _location
    ) 
        public 
    {
        Product storage p = products[_serialNumber];
        p.historySize++;
        p.history[p.historySize] = ProductHistory(p.historySize, _actor, _location);

        console.log("History Size: %s", p.historySize);
        console.log("Product History added: %s", p.history[p.historySize].actor);
        console.log("Product: %s", p.name);
    }

    function getProduct(
        string memory _serialNumber
    ) 
        public 
        view 
        returns (
            string memory, 
            string memory, 
            string memory, 
            ProductHistory[] memory
        ) 
    {
        Product storage p = products[_serialNumber];
        ProductHistory[] memory pHistory = new ProductHistory[](p.historySize);

        for (uint i = 0; i < p.historySize; i++) {
            pHistory[i] = p.history[i + 1];
        }

        return (
            p.serialNumber, 
            p.name, 
            p.brand, 
            pHistory
        );
    }
}
