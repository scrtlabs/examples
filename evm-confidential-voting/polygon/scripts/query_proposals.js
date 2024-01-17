const { ethers } = require("hardhat");
require("dotenv").config();

async function queryAllProposals() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  const ContractJson = require("../artifacts/contracts/PrivateVoting.sol/PrivateVoting.json");
  const abi = ContractJson.abi;

  // Setup provider and contract
  const provider = ethers.provider;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    // Querying open proposals
    const openProposals = await contract.getAllProposals(true);
    console.log("Open Proposals:");
    openProposals.forEach((proposal, index) => {
      console.log(`Proposal ${index + 1}:`, proposal);
    });

    // Querying closed proposals
    const closedProposals = await contract.getAllProposals(false);
    console.log("\nClosed Proposals:");
    closedProposals.forEach((proposal, index) => {
      console.log(`Proposal ${index + 1}:`, proposal);
    });
  } catch (error) {
    console.error("Error querying proposals:", error);
  }
}

queryAllProposals().catch(console.error);
