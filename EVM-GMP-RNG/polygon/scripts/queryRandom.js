const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = "0xf3431487fd737ec32279333987b1D7fBdB2faD91";

  const ContractJson = require("../artifacts/contracts/ReceiveRandom.sol/ReceiveRandom.json");
  const ABI = ContractJson.abi;

  const Contract = new ethers.Contract(contractAddress, ABI, ethers.provider);
  const randomBytes = await Contract.storedRandom();
  // Convert bytes to hex string
  const hexString = randomBytes.toString();

  // Convert hex string to list of integers
  const intArray = [];
  for (let i = 2; i < hexString.length; i += 2) {
    // start from i=2 to skip "0x" prefix
    intArray.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  console.log(`random integers: `, intArray);
  console.log("config: ", CONFIG);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
