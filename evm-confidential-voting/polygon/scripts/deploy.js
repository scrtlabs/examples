const hre = require("hardhat");

async function main() {
  let PrivateVotingFactory = await hre.ethers.getContractFactory(
    "PrivateVoting"
  );
  let privatevoting = await PrivateVotingFactory.deploy();

  console.log("PrivateVoting deployed to: ", privatevoting.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
