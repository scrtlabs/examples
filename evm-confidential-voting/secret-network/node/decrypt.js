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

decrypt([
  "0x9c9663306f99eb7ab53bc122d227aa79e54cec1965d68607c648efe700fd2a80a7b9470f8650b7719419046f046aded09d63392e951ddf95eaa8abe6bf231e99d6263f836e0cbb331535aef163b53f77118df03395d582897f9b1faf6fc3f4a3aaaeaf530a279924192dbf97b21b18eb45080034e3b9ad33937b3dcf6399d53a5d5f74f81db575051ba1d05d15b17e502c5a08f9982d1c",
]);

module.exports = {
  decrypt,
};
