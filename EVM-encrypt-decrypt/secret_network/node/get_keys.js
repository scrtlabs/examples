import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config({ path: "../../polygon/.env" });

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.testnet.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "86948e8c7f72343a4801bf6022aab4ca780b1ffa6cbb3423828f04562d7df3b0";
let contractAddress = "secret1zj4fuh42k6h2rpcnalq5wuzxys8gnqxcuhts33";

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

get_keys();
