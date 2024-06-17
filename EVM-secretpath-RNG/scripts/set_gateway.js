const { ethers } = require("hardhat");
require("dotenv").config();

const randomnessReceiverAddress =
  process.env.RANDOMNESS_RECEIVER_CONTRACT_ADDRESS;

async function set_gateway() {
  const RandomnessReceiverFactory = await hre.ethers.getContractFactory(
    "RandomnessReceiver"
  );
  const RandomnessReceiver = await RandomnessReceiverFactory.attach(
    randomnessReceiverAddress
  );

  const tx = await RandomnessReceiver.setGatewayAddress(
    process.env.AMOY_GATEWAY_ADDRESS
  );

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("Snakepath gateway connected successfully!");
}
set_gateway();
