import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url:"https://lcd.testnet.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "dd6a7f6efce42718503d07ebf3c6dadf143c1ebfaf171c5ee82c3c80845bd514";
let contractAddress = "secret1q3drrgpqrgqr54glsee0m8upkvnck44rzf9rj0";

// Query the contract for the stored message sent from Polygon
let get_stored_message = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_stored_random: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};

get_stored_message();
