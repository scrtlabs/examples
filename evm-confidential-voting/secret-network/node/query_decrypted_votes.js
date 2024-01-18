const { SecretNetworkClient, Wallet } = require("secretjs");
const dotenv = require("dotenv");
dotenv.config({ path: "../../polygon/.env" });

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash = process.env.CODE_HASH;
let contractAddress = process.env.SECRET_ADDRESS;

let queryDecryptedVotes = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_votes: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};

queryDecryptedVotes();

module.exports = {
  queryDecryptedVotes,
};
