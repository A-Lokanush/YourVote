// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Ballot = await hre.ethers.getContractFactory("Ballot");

  //Insert Proposal Names Here
  const ballot = await Ballot.deploy(
    [
      "0x506f72706f73616c204100000000000000000000000000000000000000000000",
      "0x506f72706f73616c204200000000000000000000000000000000000000000000",
      "0x506f72706f73616c204300000000000000000000000000000000000000000000",
    ],
    [ 
      "Pondicherry - Immerse in French charm and vibrant culture as we explore the quaint streets, \nserene beaches, and bustling markets of Pondicherry – a perfect blend \nof history and modernity!", 
      "Munnar - Embark on a picturesque journey through lush tea plantations and misty \nmountains in Munnar, where nature's beauty unfolds at every turn, offering a \ntranquil escape for adventure and relaxation.", 
      "Andaman - Dive into the crystal-clear waters of the Andaman Islands, where \npristine beaches, vibrant coral reefs, and thrilling water adventures create an \nunforgettable tropical paradise for an adventurous college getaway."
    ],
    10000
  );

  await ballot.waitForDeployment();

  console.log("Ballot deployed to:", await ballot.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// ["0x506f72706f73616c204100000000000000000000000000000000000000000000","0x506f72706f73616c204200000000000000000000000000000000000000000000","0x506f72706f73616c204300000000000000000000000000000000000000000000"],["Pondicherry - Immerse in French charm and vibrant culture as we explore the quaint streets, \nserene beaches, and bustling markets of Pondicherry – a perfect blend \nof history and modernity!","Munnar - Embark on a picturesque journey through lush tea plantations and misty \nmountains in Munnar, where nature's beauty unfolds at every turn, offering a \ntranquil escape for adventure and relaxation.","Andaman - Dive into the crystal-clear waters of the Andaman Islands, where \npristine beaches, vibrant coral reefs, and thrilling water adventures create an \nunforgettable tropical paradise for an adventurous college getaway."],10000
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
