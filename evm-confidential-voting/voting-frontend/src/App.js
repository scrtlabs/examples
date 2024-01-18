import React, { useState, useEffect } from "react";
import ConnectWallet from "./components/connectWallet";
import CreateProposal from "./components/createProposal";
import ProposalsList from "./components/proposalsList";
import ProposalResults from "./components/proposalResults";
import ABI from "./ABI/PrivateVoting.json";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "ethers";

import "./App.css";

const contractABI = ABI.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [openProposals, setOpenProposals] = useState([]);
  const [closedProposals, setClosedProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
    subscribeToProposalChanges();
    const interval = setInterval(fetchClosedProposals, 10000); // Poll every 10 seconds

    return () => {
      unsubscribeFromProposalChanges();
      clearInterval(interval);
    };
  }, []);

  const fetchProposals = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new Web3Provider(window.ethereum);
      const contract = new Contract(contractAddress, contractABI, provider);

      const open = await contract.getAllProposals(true);
      setOpenProposals(open);

      const closed = await contract.getAllProposals(false);
      setClosedProposals(closed);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const fetchClosedProposals = async () => {
    if (!window.ethereum) return;

    const provider = new Web3Provider(window.ethereum);
    const contract = new Contract(contractAddress, contractABI, provider);
    const allClosedProposals = await contract.getAllProposals(false);

    setClosedProposals(allClosedProposals);
  };

  const subscribeToProposalChanges = async () => {
    if (!window.ethereum) return;

    const provider = new Web3Provider(window.ethereum);
    const contract = new Contract(contractAddress, contractABI, provider);

    contract.on("VotingClosed", (proposalId) => {
      updateProposals(proposalId.toNumber());
    });
  };

  const updateProposals = async (closedProposalId) => {
    const updatedOpenProposals = openProposals.filter(
      (proposal) => proposal.id !== closedProposalId
    );
    setOpenProposals(updatedOpenProposals);

    const closedProposal = openProposals.find(
      (proposal) => proposal.id === closedProposalId
    );
    if (closedProposal) {
      setClosedProposals([...closedProposals, closedProposal]);
    }
  };

  const unsubscribeFromProposalChanges = () => {
    if (!window.ethereum) return;

    const provider = new Web3Provider(window.ethereum);
    const contract = new Contract(contractAddress, contractABI, provider);

    contract.removeAllListeners("VotingClosed");
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
