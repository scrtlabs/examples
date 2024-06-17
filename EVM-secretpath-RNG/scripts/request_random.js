const { ethers } = require("hardhat");
require("dotenv").config();

const randomnessReceiverAddress =
  process.env.RANDOMNESS_RECEIVER_CONTRACT_ADDRESS;

async function request_random() {
  const RandomnessReceiverFactory = await ethers.getContractFactory(
    "RandomnessReceiver"
  );
  const RandomnessReceiver = await RandomnessReceiverFactory.attach(
    randomnessReceiverAddress
  );

  // Create a provider
  const provider = ethers.provider;

  // Fetch the current gas price from the network
  const gasPrice = await provider.getGasPrice();
  console.log(
    `Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`
  );

  // Define your transaction parameters
  const numWords = 3; // Can be adjusted based on your needs
  const callbackGasLimit = ethers.BigNumber.from("90000"); // Adjust based on your callback needs

  // Calculate the amount of gas you have to pay for the callback
  const amountOfGas = gasPrice.mul(callbackGasLimit).mul(3).div(2);
  console.log(`Amount of gas: ${amountOfGas.toString()}`);

  try {
    // Sending the transaction with a specified gas limit and gas price
    const tx = await RandomnessReceiver.requestRandomnessTest(
      numWords,
      callbackGasLimit,
      {
        gasLimit: ethers.BigNumber.from("3000000"), // You can adjust this value based on your needs
        gasPrice: gasPrice, // Explicitly specifying the gas price
        value: amountOfGas, // Sending the calculated amount of gas
      }
    );

    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Random Numbers requested successfully!");
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

request_random();
