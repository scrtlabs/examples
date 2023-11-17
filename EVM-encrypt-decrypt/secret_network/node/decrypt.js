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
let encrypted_data;

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

// decrypt the stored encrypted data sent from EVM
let try_decrypt = async () => {
  let encrypted_data = await get_stored_message();

  const other_public_key = [
    2, 215, 19, 49, 157, 83, 199, 211, 52, 119, 40, 49, 248, 44, 20, 23, 253,
    93, 186, 195, 238, 239, 90, 163, 10, 235, 215, 246, 164, 19, 86, 195, 198,
  ];
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
      get_decrypted();
    });
};
try_decrypt();
