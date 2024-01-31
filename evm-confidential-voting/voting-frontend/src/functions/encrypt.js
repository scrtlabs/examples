import * as miscreant from "miscreant";
import { toUtf8 } from "@cosmjs/encoding";
import secp256k1 from "secp256k1/elliptic";

const provider = new miscreant.PolyfillCryptoProvider();

let ciphertext;

let publicKey = process.env.REACT_APP_SECRET_PUBLIC_KEY;
let publicByteArray = publicKey.split(",").map((num) => parseInt(num, 10));
let publicKeyUint8Array = new Uint8Array(publicByteArray);

let privateKey = process.env.REACT_APP_ECC_PRIVATE_KEY;
let privateByteArray = privateKey.split(",").map((num) => parseInt(num, 10));
let privateKeyUint8Array = new Uint8Array(privateByteArray);
// console.log(privateKeyUint8Array);

const ecdhPointX = secp256k1.ecdh(publicKeyUint8Array, privateKeyUint8Array);

const keyData = Uint8Array.from(ecdhPointX);

const encrypt = async (msg, associatedData = []) => {
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

export default encrypt;
