import secp256k1 from "secp256k1/elliptic";
import { randomBytes } from "crypto";

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

const ecdhPointX = secp256k1.ecdh(secret_pubKey, privKey);

console.log("pub: ", my_pubKey);
console.log("priv: ", Array.from(privKey));
console.log("Shared secret (32 bytes):", Array.from(ecdhPointX));
