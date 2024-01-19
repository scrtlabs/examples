import React, { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "ethers";
import encrypt from "../functions/encrypt.js";

const ProposalsList = ({ proposals, contractABI, contractAddress }) => {
  const [voteChoice, setVoteChoice] = useState(""); // State to store the selected vote choice

  const handleVote = async (proposal, choice) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Request access to the signer (MetaMask account)
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new Contract(contractAddress, contractABI, signer);

      let msg = {
        answer: choice,
        proposal_id: parseInt(proposal.id, 10),
        proposal_description: proposal.description,
        salt: Math.random(),
      };
      let my_encrypted_message = await encrypt(msg);
      console.log(choice, my_encrypted_message);
      console.log("vote: ", msg);

      // Call the vote function with the encrypted message
      const tx = await contract.vote(proposal.id, my_encrypted_message);
      await tx.wait();
      alert("Vote submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to vote.");
    }
  };

  return (
    <div>
      <h2>Open Proposals</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {proposals ? (
          proposals.map((proposal, index) => (
            <li key={index}>
              <strong>Description:</strong>{" "}
              {JSON.stringify(proposal.description)}
              <br />
              <button onClick={() => handleVote(proposal, "yes")}>
                Vote Yes
              </button>
              <button onClick={() => handleVote(proposal, "no")}>
                Vote No
              </button>
            </li>
          ))
        ) : (
          <p>No open proposals found.</p>
        )}
      </ul>
    </div>
  );
};

export default ProposalsList;
