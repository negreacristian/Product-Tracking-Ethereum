const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ProGuardModule", (m) => {
  const proGuard = m.contract("ProGuard");

  return { proGuard };
});
