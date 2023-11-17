import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "02f847147ed8fa44ad9f7b7d6cbba9737c48582bb3ef277fa29ef3a2d50a9555";
let contractAddress = "secret1d32su06845c9xvs2025p3e4wm9vdd7ftlwdlvj";

let get_decrypted = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_decrypted: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};
// get_decrypted();

// Query the contract for the stored message sent from Polygon
let get_stored_message = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_stored_message: {},
    },
    code_hash: contractCodeHash,
  });

  const hexString = query.message;

  // Convert the hex string to a byte array
  const byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.substring(i, i + 2), 16));
  }

  console.log(byteArray);
  // console.log(query);
};

get_stored_message();

let get_keys = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_keys: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};

// get_keys();
