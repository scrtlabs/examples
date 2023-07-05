import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const contract_wasm = fs.readFileSync(
  "../proxy/target/wasm32-unknown-unknown/release/secret_ibc_rng_template.wasm"
);
// const codeId = 22042;
// const contractCodeHash =
//   "4350e9119e47e4f5a2bcfc84f12ec062fe927a44253c0bc9cea08fc5a0b4fe90";
// const contractAddress = "secret1fn7v9r60u9rqgwwxmwn8hhe80ka055pultkd92";

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

const myAddress = wallet.address;

let upload_contract = async () => {
  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  console.log("codeId: ", codeId);

  // const contractCodeHash = (
  //   await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  // ).code_hash;
  // console.log(`Contract hash: ${contractCodeHash}`);

  console.log(tx.arrayLog);
};

// upload_contract();

let instantiate_contract = async () => {
  // Create an instance of the Counter contract, providing a starting count
  const initMsg = { init: {} };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "IBC Template" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 1_000_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log(contractAddress);
};

// instantiate_contract();
