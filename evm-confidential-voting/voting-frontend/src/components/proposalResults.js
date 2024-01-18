import React from "react";
import { queryDecryptedVotes } from "../functions/query_decrypted_votes.js";
// import { queryAllProposals } from "../functions/query_all_proposals.js";
const ProposalResults = ({ proposals }) => {
  let asyncQuery = async () => {
    // await queryAllProposals();
    // await queryDecryptedVotes();
  };
  asyncQuery();

  return (
    <div>
      <h2>Closed Proposals</h2>
      {proposals.length > 0 ? (
        proposals.map((proposal, index) => (
          <div key={index} className="proposal">
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p>{proposal.id.toString()}</p>
            <p>{proposal.encryptedVotes.toString()}</p>
            {/* You can add more details here */}
          </div>
        ))
      ) : (
        <p>No closed proposals available.</p>
      )}
    </div>
  );
};

export default ProposalResults;
