const fs = require("fs");
const { ethers } = require("hardhat");
require("dotenv").config();

async function queryVotes(proposalId) {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractName = "PrivateVoting"; // Replace with your contract's name

  const ContractJson = require("../artifacts/contracts/PrivateVoting.sol/PrivateVoting.json");
  const abi = ContractJson.abi;

  // Setup provider and contract
  const provider = ethers.provider;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const votes = await contract.getVotes(proposalId);
    console.log(votes);
    return votes;
  } catch (error) {
    console.error(`Error fetching votes for proposal ${proposalId}:`, error);
  }
}

let proposalId = 1;
queryVotes(proposalId);

// Export the queryVotes function
module.exports = {
  queryVotes,
};
