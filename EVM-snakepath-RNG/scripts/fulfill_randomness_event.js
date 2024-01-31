const { ethers } = require("hardhat");
require("dotenv").config();

const randomnessReceiverAddress =
  process.env.RANDOMNESS_RECEIVER_CONTRACT_ADDRESS;

async function fulfill_randomness_event() {
  const RandomnessReceiverFactory = await ethers.getContractFactory(
    "RandomnessReceiver"
  );
  const RandomnessReceiver = await RandomnessReceiverFactory.attach(
    randomnessReceiverAddress
  );

  RandomnessReceiver.on(
    "fulfilledRandomWords",
    async (requestId, randomWords) => {
      console.log(`Random numbers fulfilled for request ID: ${requestId}`);
      console.log(`Random Numbers: ${randomWords}`);
    }
  );

  console.log('Listening for the "fulfilledRandomWords" event...');
}

fulfill_randomness_event();
