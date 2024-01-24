const fs = require("fs");
const { ethers } = require("hardhat");
require("dotenv").config();

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractName = "PrivateVoting"; // Replace with your contract's name

const ContractJson = require("../artifacts/contracts/PrivateVoting.sol/PrivateVoting.json");
const abi = ContractJson.abi;

// Setup provider and contract
const provider = ethers.provider;
const contract = new ethers.Contract(contractAddress, abi, provider);

// Function to get a proposal by ID
async function getProposalById(proposalId) {
  try {
    const proposal = await contract.getProposal(proposalId);
    return {
      id: proposal[0].toNumber(),
      description: proposal[1],
      quorum: proposal[2].toNumber(),
      voteCount: proposal[3].toNumber(),
    };
  } catch (error) {
    console.error("Error fetching proposal:", error);
  }
}

// Example usage
const proposalId = 1; // Replace with the proposal ID you want to query
getProposalById(proposalId).then((proposal) => {
  console.log("Fetched Proposal:", proposal);
});

module.exports = {
  getProposalById,
};
