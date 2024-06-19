const hre = require("hardhat");

async function main() {
  // Get the Contract Factory
  const MyContract = await hre.ethers.getContractFactory("MyContract");

  // Deploy the contract
  const myContract = await MyContract.deploy();
  await myContract.deployed();

  console.log("MyContract deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
