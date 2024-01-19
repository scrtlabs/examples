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
let otherPublicKey = process.env.REACT_APP_ECC_PUBLIC_KEY.split(",").map(
  (num) => parseInt(num, 10)
);

const decrypt = async (encryptedVotes) => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        decrypt_votes: {
          public_key: otherPublicKey,
          encrypted_message: encryptedVotes,
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 2_000_000 }
  );

  console.log(tx);
};

module.exports = {
  decrypt,
};
