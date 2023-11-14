# YourVote - Your voice will be heard

## Overview

This decentralized voting application is built using Solidity for smart contract development, Hardhat as the development environment, ethers.js for interacting with the Ethereum blockchain, and Next.js for the frontend.

The application allows users to participate in a decentralized voting process, where the voting power is distributed equally among participants regardless of the amount they spend on a vote.

## Features

- **View Chairperson Hash:**
  - Click to view the Chairperson Hash responsible for managing the voting process.

- **View Leading Proposal:**
  - Display information about the leading proposal in the current poll.

- **Make Proposal Eligible/Not Eligible (Chairperson Only):**
  - Chairperson has the ability to make a proposal eligible or not eligible by entering the corresponding hash.

- **Get Information About a Proposal:**
  - Enter the proposal number to retrieve detailed information about it.

- **Vote for a Proposal with Pledge:**
  - Vote for a proposal along with a pledge. The final total amount will be pooled and distributed equally among all participants, giving everyone an equal say in the long run.

## Technologies Used

- **Solidity:**
  - Smart contract development language for creating the decentralized voting contract.

- **Hardhat:**
  - Development environment for Ethereum that helps with tasks like compiling, testing, and deploying smart contracts.

- **ethers.js:**
  - JavaScript library for interacting with the Ethereum blockchain. Used for sending transactions, querying data, and more.

- **Next.js:**
  - React framework for building the frontend of the application. Enables server-side rendering and a smooth user experience.

## Getting Started

**Install Dependencies:**
```bash
npm install
```
**Run Hardhat & Deploy the Contract**
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network <chosen_network>
```
Put the Contract Hash in the index.js for the **ballotAddress** variable

**Run the Application**
```bash
npm run dev
```

[![Chakra UI Badge](https://img.shields.io/badge/Chakra--UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)](#)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)