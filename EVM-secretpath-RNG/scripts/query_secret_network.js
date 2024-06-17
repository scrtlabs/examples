const { SecretNetworkClient, Wallet } = require("secretjs");
const dotenv = require("dotenv");
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractAddress = "secret10ex7r7c4y704xyu086lf74ymhrqhypayfk7fkj";
let contractCodeHash =
  "012dd8efab9526dec294b6898c812ef6f6ad853e32172788f54ef3c305c1ecc5";

let query_secret_network = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_execution_result: { task: { network: "80001", task_id: "6" } },
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};
query_secret_network();
