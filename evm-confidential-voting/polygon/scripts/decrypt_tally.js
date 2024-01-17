const { decrypt_tally } = require("../../secret_network/node/decrypt_tally.js");
const { queryVotes } = require("./query_proposal_votes.js");

let try_decrypt_tally = async () => {
  let encrypted_votes = await queryVotes(7);
  decrypt_tally(encrypted_votes);
};

try_decrypt_tally();
