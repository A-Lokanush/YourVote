import Head from "next/head";
import { TriangleUpIcon, InfoIcon } from "@chakra-ui/icons";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Ballot from "../artifacts/contracts/Ballot.sol/Ballot.json";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";

const ballotAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const content = "### Choose your action, the output will be displayed here \n• Click to view the Chairperson Hash\n• Click to view the leading proposal\n• Enter the hash to make it eligible (*Chairperson Only*)\n• Enter the hash to make it not eligible (*Chairperson Only*)\n• Enter the proposal number to get information about it\n• Vote for the proposal along with your pledge (must be \n  greater than the minimum pay-to-vote), final total amount\n  will be pooled and given back to everyone equally. \n  Thus the more the person spend on a vote, they will win the\n  poll but they empower the weaker in result. Hence, in the\n  long run everyone would have a say."

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [address, voterAddress] = useState();
  const [proposal, getProposals] = useState(0);
  const [removeVoter, removeVoterRights] = useState();
  const [selProposal, chosenProposal] = useState();
  const [noOfProposals, setNoOfProposals] = useState(0);
  const [settled, setSettled] = useState();
  const [voteWeight, setVoteWeight] = useState();
  const [formatterOutput, setFormatterOutput] =
    useState(`### Choose your action, the output will be displayed here \n• Click to view the Chairperson Hash\n• Click to view the leading proposal\n• Enter the hash to make it eligible (*Chairperson Only*)\n• Enter the hash to make it not eligible (*Chairperson Only*)\n• Enter the proposal number to get information about it\n• Vote for the proposal along with your pledge (must be 
  greater than the minimum pay-to-vote), final total amount\n  will be pooled and given back to everyone equally. \n  Thus the more the person spend on a vote, they will win the\n  poll but they empower the weaker in result. Hence, in the\n  long run everyone would have a say.`);

  const [deadlineTime, setDeadlineTime] = useState();
  const [timer, setTimer] = useState("");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
    };
  };

  const startTimer = (e) => {
    console.log("startTimer", e)
    let { total, hours, minutes } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          "hrs" +
          (minutes > 9 ? minutes : "0" + minutes) +
          "mins"
      );
    }
  };

  const earlyInformation = useCallback(async () => {
    let deadline = new Date();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider);
    try {
      const time = Number(await contract.end_time());
      const NoOfProposals = Number(await contract.no_of_proposals());
      const dividendsSettled = await contract.dividendSettled();
      setSettled(dividendsSettled);
      setNoOfProposals(NoOfProposals);
      deadline = new Date(time * 1000)
      setDeadlineTime(deadline);
    } catch (err) {
      console.log("Error: ", err);
    }
    return deadline;
  });
  
  useEffect(() => {
    earlyInformation();
    startTimer(deadlineTime);
  }, []);


  async function requestAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function whoischair() {
    //who is the chairperson for the contract
    await earlyInformation();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider);
    try {
      const data = await contract.chairperson();
      setFormatterOutput(`Chairperson: ${data}`);
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async function checkProposal() {
    await earlyInformation();
    if (!proposal) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider);
    console.log(contract);
    try {
      const data = await contract.proposals(proposal);
      setFormatterOutput(
        `Proposal Id: \n${data[0]}\n\nDescription: \n${data[1]}\n\nVote Count: ${ethers.formatEther(data[2])} ETH`
      );
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async function rightToVote() {
    await earlyInformation();
    //connect to the smart contract and give the right to vote
    if (!address) return; // check to see if an address was provided
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log({ provider });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transaction = await contract.giveRighttoVote(address);
      await transaction.wait();
      if (transaction.data != undefined || transaction.data != null) {
        setFormatterOutput(`${address} has been given the right to vote`);
        return;
      }
      setFormatterOutput(`Error in getting the right to vote`);
    }
  }

  async function removeVotersRights() {
    await earlyInformation();
    //connect to the smart contract and give the right to vote
    if (!removeVoter) return; // check to see if an address was provided
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log({ provider });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transaction = await contract.removeVotingRights(removeVoter);
      await transaction.wait();
      if (transaction.data != undefined || transaction.data != null) {
        setFormatterOutput(
          `${removeVoter} has been removed from the right to vote`
        );
        return;
      }
      setFormatterOutput(`Error in removing the right to vote`);
    }
  }

  async function voteForProposal() {
    await earlyInformation();
    //connect to the smart contract and give the right to vote
    if (!selProposal) return; // check to see if an address was provided
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transaction = await contract.vote(selProposal, {
        value: ethers.parseEther(voteWeight, "ether")
      });
      await transaction.wait();
      if (transaction.data != undefined || transaction.data != null) {
        setFormatterOutput(
          `Vote for the ${selProposal} has been successfully casted`
        );
        return;
      }
      setFormatterOutput(`Error in casting the vote`);
    }
  }

  async function whoIsWinning() {
    await earlyInformation();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider);
    try {
      const data = await contract.winningProposal();
      setFormatterOutput(
        `Who is Winning?: Proposal ${data} is currently winning`
      );
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async function endVoting() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer);
      const transaction = await contract.endVoting();
      await transaction.wait();
      if (transaction.data != undefined || transaction.data != null) {
        setFormatterOutput(
          `${removeVoter} Voting period ended successfully & transfer has begun`
        );
        return;
      }
      setFormatterOutput(`Error in ending the poll`);
    }
  }

  function checkDeadline() {
    return deadlineTime > new Date();
  }

  return (
    <Box className={styles.main}>
      <Head>
        <title>YourVote</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center fontSize="2.5em" m="0.5em">
        YourVote - Your voice will be heard 
                <Button
                  colorScheme="teal"
                  variant="link"
                  onClick={onOpen}
                >
                  <InfoIcon />
                </Button>
      </Center>
      <Box className={styles.body}>
        <Flex
          direction="row"
          justifyContent="space-evenly"
          className={styles.infoBar}
        >
          <Box>Contract Hash: {ballotAddress}</Box>
          <Box>Minimum Pay-To-Vote: 1.24 ETH</Box>
          <Box>Number of Proposals: {noOfProposals}</Box>
          <Box>Counter: {timer}</Box>
        </Flex>
        <Flex direction="row" justify="space-between" mt="0.5em" height="60vh">
          <Box className={styles.leftBox} width="45%">
            <pre>{formatterOutput}</pre>
          </Box>
          <Divider orientation="vertical" mx="3em" />
          <SimpleGrid
            columns={2}
            spacing="1em"
            spacingY="2em"
            className={styles.rightBox}
          >
            <VStack>
              <Box>Give Voting Rights</Box>
              <HStack>
                <Input
                  onChange={(e) => voterAddress(e.target.value)}
                  placeholder="Voter Address to Include"
                />
                <Button
                  colorScheme="teal"
                  variant="link"
                  onClick={rightToVote}
                  isDisabled={!checkDeadline()}
                >
                  <TriangleUpIcon />
                </Button>
              </HStack>
            </VStack>
            <VStack>
              <Box>Remove Voting Rights</Box>
              <HStack>
                <Input
                  onChange={(e) => removeVoterRights(e.target.value)}
                  placeholder="Voter Address to Remove"
                />
                <Button
                  colorScheme="teal"
                  variant="link"
                  onClick={removeVotersRights}
                  isDisabled={!checkDeadline()}
                >
                  <TriangleUpIcon />
                </Button>
              </HStack>
            </VStack>
            <VStack>
              <Box>Vote</Box>
              <HStack>
                <NumberInput min={0} max={noOfProposals} onChange={(e) => chosenProposal(e)}>
                  <NumberInputField />
                </NumberInput>
                <NumberInput min={1.24} onChange={(e) => setVoteWeight(e)}>
                  <NumberInputField />
                </NumberInput>
                <Button
                  colorScheme="teal"
                  variant="link"
                  onClick={voteForProposal}
                  isDisabled={!checkDeadline() || voteWeight <= 1.24}
                >
                  <TriangleUpIcon />
                </Button>
              </HStack>
            </VStack>
            <VStack>
              <Box>Get Proposal</Box>
              <HStack>
                <NumberInput min={0} max={noOfProposals} onChange={(e) => getProposals(e)}>
                  <NumberInputField />
                </NumberInput>
                <Button
                  colorScheme="teal"
                  variant="link"
                  onClick={checkProposal}
                >
                  <TriangleUpIcon />
                </Button>
              </HStack>
            </VStack>
            <VStack>
              <Box>Chairperson</Box>
              <Button colorScheme="teal" variant="link" onClick={whoischair}>
                Click
              </Button>
            </VStack>
            <VStack>
              <Box>Who {checkDeadline() ? "is Winning" : "Won"}</Box>
              <Button colorScheme="teal" variant="link" onClick={whoIsWinning}>
                Click
              </Button>
            </VStack>
            {!settled ? (
              <VStack>
                <Box>End & Distribute</Box>
                <Button colorScheme="teal" variant="link" onClick={endVoting}>
                  Click
                </Button>
              </VStack>
            ) : null}
          </SimpleGrid>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay />
        <ModalContent className={styles.modal}>
          <ModalHeader className={styles.modal} fontSize="3em"><Center>Rules of Operation</Center></ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles.modal}>
            <Center className={styles.modal}><pre>{content}</pre></Center>
          </ModalBody>
          <ModalFooter className={styles.modal}>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    
  );
}
