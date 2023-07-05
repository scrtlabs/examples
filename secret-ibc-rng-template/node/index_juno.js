import { SigningCosmWasmClient, Secp256k1HdWallet, GasPrice } from "cosmwasm";

import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// const myAddress = "juno1r665g4jg649zce3u8q9d0qzzq7wehxjsjd6y0l";

//   let consumer_proxy_juno_address =
// juno18wa7vw84rwjgfej8vhqzhaampurj43uh24heaztcju9x7l6ph8vqzmkez2;

// let consumer_address = juno1wz2rn6tcnzu9p7ns2mgxyg6nl0q9gwzhsjrpwq7s7pua00z786ys4rpxe2;

const rpcEndpoint = "https://rpc.uni.juno.deuslabs.fi/";

let fee = { amount: [{ amount: "1000", denom: "ujunox" }], gas: "200000" };

const wallet = new Wallet(process.env.MNEMONIC);

const config = {
  chainId: "uni-6",
  rpcEndpoint: rpcEndpoint,
  prefix: "juno",
};

const consumer_wasm = fs.readFileSync(
  "../consumer/target/wasm32-unknown-unknown/release/consumer.wasm"
);

// const codeId = 1922;

async function upload() {
  let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "juno",
  });
  let gas = GasPrice.fromString("0.025ujunox");
  let client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice: gas }
  );

  let res = await client.upload(
    "juno1r665g4jg649zce3u8q9d0qzzq7wehxjsjd6y0l",
    consumer_wasm,
    "auto"
  );
  console.log(res);
}

// upload();

let instantiate = async () => {
  let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "juno",
  });
  let gas = GasPrice.fromString("0.025ujunox");
  let client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice: gas }
  );

  let init_msg = {};
  let msg = Buffer.from(JSON.stringify(init_msg));

  let res = await client.instantiate(
    myAddress,
    codeId,
    "consumer-ibc-template",
    fee,
    [],
    msg
  );
  console.log(res);
};

// instantiate();
