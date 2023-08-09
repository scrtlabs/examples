import { Secp256k1HdWallet, GasPrice } from "cosmwasm";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const rpcEndpoint = "https://uni-rpc.reece.sh/";
const myAddress = "juno1r665g4jg649zce3u8q9d0qzzq7wehxjsjd6y0l";

let codeId = 3166;

const wallet = await Secp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, {
  prefix: "juno",
});
const gas = GasPrice.fromString("0.025ujunox");
const client = await SigningCosmWasmClient.connectWithSigner(
  rpcEndpoint,
  wallet,
  { gasPrice: gas }
);
const juno_proxy_wasm = fs.readFileSync(
  "../consumer-side-proxy/target/wasm32-unknown-unknown/release/secret_ibc_rng_template.wasm"
);

async function upload() {
  let res = await client.upload(myAddress, juno_proxy_wasm, "auto");
  console.log(res);
}

// upload();

let instantiate = async () => {
  let init_msg = {};

  let res = await client.instantiate(
    myAddress,
    codeId,
    {},
    "consumer vrf proxy contract",
    "auto"
  );
  console.log(res);
};

// instantiate();
