import * as miscreant from "miscreant";
import { fromBase64, fromHex, toUtf8 } from "@cosmjs/encoding";
import { PrivateKey, utils } from "eciesjs";

let provider = new miscreant.PolyfillCryptoProvider();

// const keyData = new Uint8Array(32).fill(1);
const keyData = Uint8Array.from([
  207, 105, 235, 195, 220, 116, 245, 93, 102, 112, 75, 45, 129, 31, 3, 99, 103,
  54, 45, 53, 18, 254, 197, 252, 84, 99, 151, 35, 41, 138, 83, 220,
]);

let encrypt = async (msg, associatedData = []) => {
  const siv = await miscreant.SIV.importKey(keyData, "AES-SIV", provider);
  const plaintext = toUtf8(JSON.stringify(msg));

  try {
    const ciphertext = await siv.seal(plaintext, associatedData);
    console.log("Encrypted data:", ciphertext);
    return ciphertext;
  } catch (e) {
    console.warn("Error encrypting data:", e);
    throw e;
  }
};

let decrypt = async (ciphertext, associatedData = []) => {
  const siv = await miscreant.SIV.importKey(keyData, "AES-SIV", provider);

  try {
    let decrypted = await siv.open(ciphertext, associatedData);
    const convertedString = String.fromCharCode(...decrypted);
    console.log("Decrypted data:", convertedString);
    return convertedString;
  } catch (e) {
    console.warn("Error decrypting data:", e);
    throw e;
  }
};

// Usage example
let msg = { i_like_turtles: "I like turtles!" };
encrypt(msg).then((ciphertext) => {
  decrypt(ciphertext);
});
