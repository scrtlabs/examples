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

// decrypt([
//   "0xacd8ff6547141c682bb6cbf136a71fbce3c16966ee9583f6a72bd9dca9c1650e0e405d87b753432980b105b79e149b2d043cf530d9280efd7ab8fd9361db712e1372818c19b30deda8c7331f6b8eabee6016d01feb2a0dce1f247289bff6c2e2fc3bd2c03fafac54ba83201d018e582cade16dbd43cda1a1e3",
// ]);

module.exports = {
  decrypt,
};
