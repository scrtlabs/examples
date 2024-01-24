const { ethers } = require("hardhat");
const { queryVotes } = require("./query_proposal_votes.js");
const {
  queryDecryptedVotes,
} = require("../../secret-network/node/query_decrypted_votes.js");
const { decrypt } = require("../../secret-network/node/decrypt.js");
require("dotenv").config();

async function decrypt_votes() {
  let encrypted_vote = await queryVotes(1);
  await decrypt(encrypted_vote);
  await queryDecryptedVotes();
}
decrypt_votes();
