import React from "react";
import { queryDecryptedVotes } from "../functions/query_decrypted_votes.js";
import { queryVotes } from "../functions/query_proposal_votes.js";
import { queryAllProposals } from "../functions/query_all_proposals.js";
import { decrypt } from "../functions/decrypt.js";

async function handleDecryptVotes(proposalId) {
  try {
    // Convert proposalId to a number to ensure strict equality checks work later
    proposalId = Number(proposalId);

    let encrypted_vote = await queryVotes(proposalId);
    await decrypt(encrypted_vote);
    let decryptedData = await queryDecryptedVotes();

    if (!decryptedData || !Array.isArray(decryptedData.votes)) {
      console.error("Invalid decrypted data:", decryptedData);
      return;
    }

    // Log the complete decryptedData for inspection
    console.log("Decrypted Votes Data:", decryptedData.votes);

    let filteredVotes = decryptedData.votes.filter((voteStr) => {
      let voteObj = JSON.parse(voteStr);
      // Log each parsed vote object to inspect the structure and values
      console.log("Parsed Vote Object:", voteObj);
      return voteObj.proposal_id === proposalId;
    });

    // Log the filtered votes to ensure filtering is working correctly
    console.log("Filtered Votes:", filteredVotes);

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

    // Log the counts to ensure tallying is working correctly
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
}

const ProposalResults = ({ proposals }) => {
  return (
    <div>
      <h2>Closed Proposals</h2>
      {proposals.length > 0 ? (
        proposals.map((proposal, index) => (
          <div key={index} className="proposal">
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p>Proposal ID: {proposal.id.toString()}</p>
            {/* <p>Encrypted: {proposal.encryptedVotes}</p> */}
            <button onClick={() => handleDecryptVotes(proposal.id)}>
              Decrypt Votes
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
