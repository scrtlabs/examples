const { Web3Provider } = require("@ethersproject/providers");
const { Contract } = require("ethers");

async function queryAllProposals() {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const ContractJson = require("../ABI/PrivateVoting.json");
  const contractABI = ContractJson.abi;

  const provider = new Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract = new Contract(contractAddress, contractABI, signer);

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
module.exports = {
  queryAllProposals,
};
