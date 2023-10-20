import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "secret-4",
  url: "https://lcd.mainnet.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "f2e21a5ee09296464248a293f4050979d7c76a2e9a8a293e24c95632808d3c6b";
let contractAddress = "secret1fez27f578vuqprd73p08v65vntq2apg9rjdax7";

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
