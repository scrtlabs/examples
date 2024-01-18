const { SecretNetworkClient, Wallet } = require("secretjs");

const wallet = new Wallet(process.env.REACT_APP_MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash = process.env.REACT_APP_CODE_HASH;
let contractAddress = process.env.REACT_APP_SECRET_ADDRESS;

let queryDecryptedVotes = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_votes: {},
    },
    code_hash: contractCodeHash,
  });
  console.log(query);
  return query;
};

module.exports = {
  queryDecryptedVotes,
};
