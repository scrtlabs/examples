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
let other_public_key = process.env.ECC_PUBLIC_KEY.split(",").map((num) =>
  parseInt(num, 10)
);

let decrypt = async (encrypted_votes) => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        decrypt_votes: {
          public_key: other_public_key,
          encrypted_message: encrypted_votes,
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 2_000_000 }
  );

  console.log(tx);
};

// decrypt_tally([
//   "0x67705c189e85fe91e38406a1ee3cd38a7345986f4fe6810bc5f4a2061213d9ca2f9e3e3d451c33f605369413de42c5113c8349acb68d17061db8",
//   "0xb81ec9e3c664217b85800776e1566f8dc4c782da25a2511ec21820e2ba82224d1594948824c6672bf17627116d4e4f20fe11a6f9e749b2532d00",
// ]);

module.exports = {
  decrypt,
};
