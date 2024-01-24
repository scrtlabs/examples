const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const { decrypt } = require("../../secret-network/node/decrypt.js");
const {
  queryDecryptedVotes,
} = require("../../secret-network/node/query_decrypted_votes.js");

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

const proposalId = 1;

async function decrypt_votes() {
  let encrypted_vote = await queryVotes(proposalId);
  await decrypt(encrypted_vote);
  await queryDecryptedVotes();
}
decrypt_votes();
