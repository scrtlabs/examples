import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "dd6a7f6efce42718503d07ebf3c6dadf143c1ebfaf171c5ee82c3c80845bd514";
let contractAddress = "secret1q3drrgpqrgqr54glsee0m8upkvnck44rzf9rj0";

//send_message_evm variables
let destinationChain = "Polygon";
let destinationAddress = "0x4396a9F3b1962bC7277fC44a78AA5c57e8966978";

let send_message_evm = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        send_message_evm: {
          destination_chain: destinationChain,
          destination_address: destinationAddress,
        },
      },
      code_hash: contractCodeHash,
      sent_funds: [
        {
          amount: "250000",
          denom:
            "ibc/9463E39D230614B313B487836D13A392BD1731928713D4C8427A083627048DB3",
        },
      ],
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};
send_message_evm();
