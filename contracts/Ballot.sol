// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

contract Ballot{

    struct Voter{
        uint weight;
        bool voted;
        uint vote;
    }
    struct Proposal{
        bytes32 name; 
        string description;
        uint voteCount; 
    }
    modifier timeOver {
        require(block.timestamp <= end_time, "Voting Period is Over. No more votes will be accepted");
        _;
    }

    address public chairperson;
    uint public no_of_proposals;
    uint public end_time;
    uint public totalAmount;
    address[] public receipients;
    mapping (address => Voter) public voters;
    Proposal[] public proposals;
    bool public dividendSettled = false;

    constructor(bytes32[] memory proposalNames, string [] memory proposalDescriptions, uint time){
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        no_of_proposals = proposalNames.length;
        uint timeCheck = time * 1 seconds;
        end_time = block.timestamp + timeCheck;
        for (uint i = 0; i<proposalNames.length; i++){
            proposals.push(Proposal({
                name: proposalNames[i],
                description: proposalDescriptions[i],
                voteCount: 0
            }));
        }
    }


    function giveRighttoVote(address voter) external timeOver {
        require(
            msg.sender == chairperson,
            "Only Chairperson allowed to assign voting rights."
        );
        require(
            !voters[voter].voted,
            "Voter already voted once"
        );
        require(voters[voter].weight == 0);     
        voters[voter].weight = 1;
    }

    function removeVotingRights(address voter) external timeOver {
        require(msg.sender == chairperson, "Only Chairperson allowed to remove voting rights.");
        require(!voters[voter].voted, "Voter cannot be removed while vote is active.");
        require(voters[voter].weight == 1);
        voters[voter].weight = 0;
    }

    function vote(uint proposal) external payable timeOver {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "No right to vote");
        require(!sender.voted, "Already voted once.");
        require(msg.value > 1.24 ether);
        sender.voted = true;
        sender.vote = proposal;
        sender.weight = msg.value;
        receipients.push(msg.sender);
        proposals[proposal].voteCount += sender.weight;
        totalAmount += sender.weight;
    }

    function winningProposal() public view
        returns (uint winningProposal_){
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++){
            if(proposals[p].voteCount > winningVoteCount){
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function remainingTime() external view returns (uint remainingTime_) {
        if(block.timestamp < end_time) remainingTime_ = end_time - block.timestamp;
        else remainingTime_ = 0;
    }

    function endVoting() external {
        require(msg.sender == chairperson, "Only Chairperson allowed to remove voting rights.");
        end_time = block.timestamp;
        uint dividend = (totalAmount / receipients.length);
        for (uint i = 0; i < receipients.length; i++){
            address payable receipient = payable(receipients[i]);
            receipient.transfer(dividend);
        }
        totalAmount = 0;
        dividendSettled = true;
    }
}