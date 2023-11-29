const miscreant = require("miscreant");
const { fromBase64, fromHex, toUtf8 } = require("@cosmjs/encoding");
const { ethers } = require("hardhat");
const secp256k1 = require("secp256k1/elliptic.js");
const { randomBytes } = require("crypto");
const fs = require("fs");
const path = require("path");

let provider = new miscreant.PolyfillCryptoProvider();
let ciphertext;
let my_pubKey;

function getPrivateKey() {
  while (true) {
    const privKey = randomBytes(32);
    if (secp256k1.privateKeyVerify(privKey)) return privKey;
  }
}

let privKey = getPrivateKey();

let secret_pubKey = new Uint8Array([
  2, 104, 48, 161, 13, 111, 158, 104, 127, 247, 41, 86, 51, 182, 130, 236, 211,
  221, 131, 107, 252, 151, 228, 19, 153, 252, 169, 84, 186, 154, 203, 40, 138,
]);

// get the public key in a compressed format
my_pubKey = secp256k1.publicKeyCreate(privKey);
// console.log("evm pub key: ", my_pubKey);

// Path to your .env file
const envFilePath = path.join(__dirname, "../.env");

// Read the current contents of the file
let envContents = "";
if (fs.existsSync(envFilePath)) {
  envContents = fs.readFileSync(envFilePath, "utf8");
}

// Replace or append the MY_PUB_KEY variable
const keyPattern = /^MY_PUB_KEY=.*/m;
if (keyPattern.test(envContents)) {
  // Replace the existing line
  envContents = envContents.replace(keyPattern, `MY_PUB_KEY=${my_pubKey}`);
} else {
  // Append the new key, ensure it starts on a new line
  envContents +=
    (envContents.endsWith("\n") ? "" : "\n") + `MY_PUB_KEY=${my_pubKey}\n`;
}

// Write the updated contents back to the file
fs.writeFileSync(envFilePath, envContents);

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
    "0xd100A79C25bBFFb08AaFa7E8000cd10667397967"; // Replace with your deployed contract's address
  const destinationChain = "secret"; // Replace with your desired destination chain
  const destinationAddress = "secret1zj4fuh42k6h2rpcnalq5wuzxys8gnqxcuhts33"; // Replace with your desired destination address

  let msg = { date: "nov 27" };
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
      value: ethers.utils.parseEther("0.35"), // Adjust the amount as needed for gas
    }
  );

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("send function executed successfully!");
}
encrypt_evm();
