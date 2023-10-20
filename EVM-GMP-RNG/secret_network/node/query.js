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

let contractCodeHash =
  "3db2def07511bdb6bb2c22be7d9649a3601f364ccd835dc15b2f964687b94a53";
let contractAddress = "secret1wu6j02kp7stztwanzrtha5cy0ex3gsffz4p2t9";

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
