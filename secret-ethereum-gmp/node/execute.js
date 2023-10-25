import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "90cc33f5f8313e8c584516d1196ff8b52520a86926cf6967e8361c717e91d5c2";
let contractAddress = "secret1qdkf9630dmpekkmww873e5tec3jxs0klqzg9fr";

//send_message_evm variables
let destinationChain = "Polygon";
let destinationAddress = "0xAC3c5E4d9f20419Ca9b92B1EdF44309D2cd9F61C";
let myMessage = "i like turtles";

let send_message_evm = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        send_message_evm: {
          destination_chain: destinationChain,
          destination_address: destinationAddress,
          message: myMessage,
        },
      },
      code_hash: contractCodeHash,
      sent_funds: [
        {
          amount: "150000",
          denom:
            "ibc/9463E39D230614B313B487836D13A392BD1731928713D4C8427A083627048DB3",
        },
      ],
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};
send_message_evm();
