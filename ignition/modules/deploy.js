const { ignition } = require("hardhat");

async function main() {
  // Load the deployment module
  const { proGuard } = await ignition.deployModule(require("../modules/ProGuardModule"));

  console.log("ProGuard deployed to:", proGuard.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
