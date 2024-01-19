const { Web3Provider } = require("@ethersproject/providers");
const { Contract } = require("ethers");

async function queryVotes(proposalId) {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const ContractJson = require("../ABI/PrivateVoting.json");
  const contractABI = ContractJson.abi;

  const provider = new Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract = new Contract(contractAddress, contractABI, signer);

  try {
    const votes = await contract.getVotes(proposalId);
    console.log(votes);
    return votes;
  } catch (error) {
    console.error(`Error fetching votes for proposal ${proposalId}:`, error);
  }
}

// queryVotes(1);

// Export the queryVotes function
module.exports = {
  queryVotes,
};
