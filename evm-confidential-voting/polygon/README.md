npx hardhat compile

npx hardhat run scripts/deploy.js --network polygon

PrivateVoting deployed to: 0x14332ACE418E5E067e90E7fB21d329dF44F1C6b2

npx hardhat --network polygon run ./scripts/create_proposal.js
npx hardhat --network polygon run ./scripts/query_proposal.js
npx hardhat --network polygon run ./scripts/query_proposal_votes.js
npx hardhat --network polygon run ./scripts/vote.js
npx hardhat --network polygon run ./scripts/tally.js
npx hardhat --network polygon run ./scripts/query_all_votes.js
