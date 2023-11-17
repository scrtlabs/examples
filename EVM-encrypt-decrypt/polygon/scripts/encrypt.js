const miscreant = require("miscreant");
const { fromBase64, fromHex, toUtf8 } = require("@cosmjs/encoding");
const { ethers } = require("hardhat");
const secp256k1 = require("secp256k1/elliptic.js");
const { randomBytes } = require("crypto");

let provider = new miscreant.PolyfillCryptoProvider();
let ciphertext;

function getPrivateKey() {
  while (true) {
    const privKey = randomBytes(32);
    if (secp256k1.privateKeyVerify(privKey)) return privKey;
  }
}

let privKey = getPrivateKey();

let secret_pubKey = new Uint8Array([
  3, 237, 113, 94, 12, 27, 61, 95, 66, 244, 64, 230, 104, 252, 254, 74, 140,
  112, 129, 218, 235, 64, 29, 110, 136, 43, 204, 103, 99, 20, 35, 55, 177,
]);

// // get the public key in a compressed format
let my_pubKey = secp256k1.publicKeyCreate(privKey);
console.log("evm pub key: ", my_pubKey);

const ecdhPointX = secp256k1.ecdh(secret_pubKey, privKey);

let keyData = Uint8Array.from(ecdhPointX);

let encrypt = async (msg, associatedData = []) => {
  const siv = await miscreant.SIV.importKey(keyData, "AES-SIV", provider);
  const plaintext = toUtf8(JSON.stringify(msg));

  try {
    ciphertext = await siv.seal(plaintext, associatedData);
    console.log("Encrypted data:", ciphertext);
    return ciphertext;
  } catch (e) {
    console.warn("Error encrypting data:", e);
    throw e;
  }
};

async function encrypt_evm() {
  const sendReceiveEncryptAddress =
    "0x0DC75cB5CE7335fa335b03F34d6f9a7697fA9336"; // Replace with your deployed contract's address
  const destinationChain = "secret"; // Replace with your desired destination chain
  const destinationAddress = "secret1d32su06845c9xvs2025p3e4wm9vdd7ftlwdlvj"; // Replace with your desired destination address

  let msg = { test: "today is the 16th of november, 2023" };
  let my_encrypted_message = await encrypt(msg);
  const SendReceiveEncrypt = await ethers.getContractFactory(
    "SendReceiveEncrypt"
  );
  const sendReceiveEncrypt = await SendReceiveEncrypt.attach(
    sendReceiveEncryptAddress
  );

  const tx = await sendReceiveEncrypt.send(
    destinationChain,
    destinationAddress,
    my_encrypted_message,
    {
      value: ethers.utils.parseEther("0.3"), // Adjust the amount as needed for gas
    }
  );

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("send function executed successfully!");
}
encrypt_evm();
