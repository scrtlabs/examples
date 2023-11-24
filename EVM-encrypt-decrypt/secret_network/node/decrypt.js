import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config({ path: "../../polygon/.env" });

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
let encrypted_data;
let other_public_key = process.env.MY_PUB_KEY.split(",").map((num) =>
  parseInt(num, 10)
);

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
  // console.log(byteArray);
  return byteArray;
};

// get_stored_message();

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

get_decrypted();

// decrypt the stored encrypted data sent from EVM
let try_decrypt = async () => {
  let encrypted_data = await get_stored_message();
  const tx = await secretjs.tx.compute
    .executeContract(
      {
        sender: wallet.address,
        contract_address: contractAddress,
        msg: {
          try_decrypt: {
            ciphertext: encrypted_data,
            public_key: other_public_key,
          },
        },
        code_hash: contractCodeHash,
      },
      { gasLimit: 100_000 }
    )
    .then((tx) => {
      console.log(tx);
      get_decrypted();
    });
};
// try_decrypt();
