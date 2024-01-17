const miscreant = require("miscreant");
const { toUtf8 } = require("@cosmjs/encoding");
const secp256k1 = require("secp256k1/elliptic.js");
const dotenv = require("dotenv");

let provider = new miscreant.PolyfillCryptoProvider();
let ciphertext;

let publicKey = dotenv.config().parsed.SECRET_PUBLIC_KEY;
let publicByteArray = publicKey.split(",").map((num) => parseInt(num, 10));
let publicKeyUint8Array = new Uint8Array(publicByteArray);

let privateKey = dotenv.config().parsed.ECC_PRIVATE_KEY;
let privateByteArray = privateKey.split(",").map((num) => parseInt(num, 10));
let privateKeyUint8Array = new Uint8Array(privateByteArray);
// console.log(privateKeyUint8Array);

const ecdhPointX = secp256k1.ecdh(publicKeyUint8Array, privateKeyUint8Array);

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

module.exports = { encrypt };
