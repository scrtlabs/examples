import React, { useState, useEffect } from "react";
import ConnectWallet from "./components/connectWallet";
import CreateProposal from "./components/createProposal";
import ProposalsList from "./components/proposalsList";
import ProposalResults from "./components/proposalResults";
import ABI from "./ABI/PrivateVoting.json";
import { ethers } from "ethers";
import "./App.css";

const contractABI = ABI.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [openProposals, setOpenProposals] = useState([]);
  const [closedProposals, setClosedProposals] = useState([]);
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          // Fetch open proposals
          const open = await contract.getAllProposals(true);
          if (open.length === 0) {
            console.log("No open proposals");
          } else {
            setOpenProposals(open);
          }

          // Fetch closed proposals
          const closed = await contract.getAllProposals(false);
          setClosedProposals(closed);
        } else {
          alert("Please install MetaMask!");
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    // Call the function immediately to fetch initial data
    fetchProposals();

    // Set up the interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchProposals, 10000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const refreshProposals = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds delay

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // Re-fetch open proposals
    const open = await contract.getAllProposals(true);
    setOpenProposals(open);

    // Re-fetch closed proposals
    const closed = await contract.getAllProposals(false);
    setClosedProposals(closed);
  };

  return (
    <div className="App">
      <ConnectWallet />
      <div className="header">
        <h1>Private Voting on Secret Network</h1>
      </div>
      <div className="columns">
        <CreateProposal
          contractABI={contractABI}
          contractAddress={contractAddress}
        />
        <div className="column">
          <div className="proposal-list">
            <ProposalsList
              proposals={openProposals}
              contractABI={contractABI}
              contractAddress={contractAddress}
              onVote={refreshProposals}
            />
          </div>
        </div>
        <div className="column">
          <ProposalResults proposals={closedProposals} />
        </div>
      </div>
    </div>
  );
}

export default App;
