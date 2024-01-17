const { fromBase64, fromHex, toUtf8 } = require("@cosmjs/encoding");
const { ethers } = require("hardhat");
const { encrypt } = require("./encrypt");
require("dotenv").config();

const privateVotingAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract's address

const proposal_id = 4;

async function vote() {
  let msg = {
    answer: "yes",
    proposal_id: proposal_id,
    proposal_description: "Is this proposal id 4",
    salt: Math.random(),
  };

  let my_encrypted_message = await encrypt(msg);
  let PrivateVoting = await hre.ethers.getContractFactory("PrivateVoting");
  const privateVoting = await PrivateVoting.attach(privateVotingAddress);

  const tx = await privateVoting.vote(proposal_id, my_encrypted_message);

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("vote function executed successfully!");
}
vote();
