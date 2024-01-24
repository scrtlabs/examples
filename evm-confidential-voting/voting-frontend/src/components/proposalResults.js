import React, { useState } from "react";
import { queryDecryptedVotes } from "../functions/query_decrypted_votes.js";
import { queryVotes } from "../functions/query_proposal_votes.js";
import { decrypt } from "../functions/decrypt.js";

const ProposalResults = ({ proposals }) => {
  const [decryptingProposalId, setDecryptingProposalId] = useState(null);

  const handleDecryptVotes = async (proposalId) => {
    setDecryptingProposalId(proposalId); // Start decrypting
    try {
      proposalId = Number(proposalId);

      let encrypted_vote = await queryVotes(proposalId);
      await decrypt(encrypted_vote);
      let decryptedData = await queryDecryptedVotes();

      if (!decryptedData || !Array.isArray(decryptedData.votes)) {
        console.error("Invalid decrypted data:", decryptedData);
        return;
      }

      console.log("Decrypted Votes Data:", decryptedData.votes);

      let filteredVotes = decryptedData.votes.filter((voteStr) => {
        let voteObj = JSON.parse(voteStr);
        return voteObj.proposal_id === proposalId;
      });

      if (filteredVotes.length === 0) {
        alert("No votes found for proposal " + proposalId);
        return;
      }

      if (filteredVotes.length === 1) {
        let voteObj = JSON.parse(filteredVotes[0]);
        alert(
          voteObj.answer.toUpperCase() +
            " wins by default for proposal " +
            proposalId
        );
        return;
      }

      let yesCount = 0;
      let noCount = 0;

      filteredVotes.forEach((voteStr) => {
        let voteObj = JSON.parse(voteStr);
        if (voteObj.answer === "yes") yesCount++;
        if (voteObj.answer === "no") noCount++;
      });

      console.log("Yes Count:", yesCount, "No Count:", noCount);

      let resultMessage = "It's a tie for proposal " + proposalId;
      if (yesCount > noCount)
        resultMessage = "YES wins for proposal " + proposalId;
      else if (noCount > yesCount)
        resultMessage = "NO wins for proposal " + proposalId;

      alert(resultMessage);
    } catch (error) {
      console.error("Error in handleDecryptVotes:", error);
    }
    setDecryptingProposalId(null); // Finish decrypting
  };

  const sortedProposals = [...proposals].sort((a, b) => b.id - a.id);

  return (
    <div>
      <h2>Closed Proposals</h2>
      {sortedProposals.length > 0 ? (
        sortedProposals.map((proposal, index) => (
          <div key={index} className="proposal">
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p>Proposal ID: {proposal.id.toString()}</p>
            <button
              onClick={() => handleDecryptVotes(proposal.id)}
              disabled={decryptingProposalId === proposal.id}
            >
              {decryptingProposalId === proposal.id
                ? "Decrypting..."
                : "Decrypt Votes"}
            </button>
          </div>
        ))
      ) : (
        <p>No closed proposals available.</p>
      )}
    </div>
  );
};

export default ProposalResults;
