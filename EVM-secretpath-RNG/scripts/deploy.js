const hre = require("hardhat");

async function main() {
  let RandomnessReceiverFactory = await hre.ethers.getContractFactory(
    "RandomnessReceiver"
  );
  let randomness_receiver = await RandomnessReceiverFactory.deploy();

  console.log("RandomnessReceiver deployed to: ", randomness_receiver.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
