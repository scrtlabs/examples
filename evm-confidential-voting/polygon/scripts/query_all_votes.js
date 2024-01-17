const fs = require("fs");
const { ethers } = require("hardhat");
require("dotenv").config();

async function queryVotes() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractName = "PrivateVoting"; // Replace with your contract's name

  const ContractJson = require("../artifacts/contracts/PrivateVoting.sol/PrivateVoting.json");
  const abi = ContractJson.abi;

  // Setup provider and contract
  const provider = ethers.provider;
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Get the next proposal ID
  const nextProposalId = await contract.nextProposalId();

  // Iterate over all proposals and log their votes
  for (let i = 1; i < nextProposalId; i++) {
    try {
      const votes = await contract.getVotes(i);
      console.log(`Votes for Proposal ${i}:`, votes);
    } catch (error) {
      console.error(`Error fetching votes for proposal ${i}:`, error);
    }
  }
}

queryVotes().catch(console.error);
