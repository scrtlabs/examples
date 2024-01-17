// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PrivateVoting {
    event ProposalCreated(uint indexed proposalId, string description);
    event Voted(uint indexed proposalId, address indexed voter, bytes encryptedVote);
    event VotingClosed(uint indexed proposalId);

    struct Proposal {
        uint id; 
        string description;
        mapping(address => bool) hasVoted;
        bytes[] encryptedVotes;
        uint quorum;
        uint voteCount;
    }

    mapping(uint => Proposal) public proposals;
    uint public nextProposalId = 1;

    function createProposal(string memory description, uint quorum) external returns (uint proposalId) {
        proposalId = nextProposalId;
        nextProposalId++;
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.description = description;
        proposal.quorum = quorum;
        emit ProposalCreated(proposalId, description);
    }

    function getProposal(uint proposalId) external view returns (uint, string memory, uint, uint) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.id, proposal.description, proposal.quorum, proposal.voteCount);
    }

    function vote(uint proposalId, bytes calldata encryptedVote) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(proposal.voteCount < proposal.quorum, "Voting closed");

        proposal.encryptedVotes.push(encryptedVote);
        proposal.hasVoted[msg.sender] = true;
        proposal.voteCount++;

        emit Voted(proposalId, msg.sender, encryptedVote);

        if (proposal.voteCount >= proposal.quorum) {
            emit VotingClosed(proposalId);
        }
    }

    function getVotes(uint proposalId) external view returns (bytes[] memory) {
        return proposals[proposalId].encryptedVotes;
    }

    struct ProposalInfo {
        uint id;
        string description;
        uint quorum;
        uint voteCount;
        bytes[] encryptedVotes;
    }

    function getAllProposals(bool open) external view returns (ProposalInfo[] memory) {
        uint count = 0;
        for (uint i = 1; i < nextProposalId; i++) {
            if ((proposals[i].voteCount < proposals[i].quorum) == open) {
                count++;
            }
        }

        ProposalInfo[] memory proposalsInfo = new ProposalInfo[](count);
        uint index = 0;
        for (uint i = 1; i < nextProposalId; i++) {
            if ((proposals[i].voteCount < proposals[i].quorum) == open) {
                Proposal storage proposal = proposals[i];
                proposalsInfo[index] = ProposalInfo({
                    id: proposal.id,
                    description: proposal.description,
                    quorum: proposal.quorum,
                    voteCount: proposal.voteCount,
                    encryptedVotes: open ? new bytes[](0) : proposal.encryptedVotes
                });
                index++;
            }
        }

        return proposalsInfo;
    }
}
