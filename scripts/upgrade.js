// scripts/upgrade_box.js
require('dotenv').config();
const { ethers, upgrades } = require('hardhat');
const { API_URL, PRIVATE_KEY, POLYGON_KEY, CONTRACT_ADDRESS } = process.env;

async function main() {
  const ERC721 = await ethers.getContractFactory("WolfPack");
  console.log('Upgrading WolfPack...', '0x2e7d333d983aefbbcc011bce98a5ad4e83288d8f');
  await upgrades.upgradeProxy('0x2e7d333d983aefbbcc011bce98a5ad4e83288d8f', ERC721);
  console.log('WolfPack CONTRACT UPGRADED');
}

main().then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });