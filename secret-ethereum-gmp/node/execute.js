import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "secret-4",
  url: "https://lcd.mainnet.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash =
  "7ce84114e0d1401a8bdf37717a0d1389e348cf2ac26e2c79a1e4b301452c71e6";
let contractAddress = "secret1k0s02fqqmlhq4g7qmlq9w76p4g9htwelszlk2y";

//send_message_evm variables
let destinationChain = "Polygon";
let destinationAddress = "0x13ACd5794A3136E7fAc8f9727259930fcab1290F";
let myMessage = "secret network to polygon";

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
            "ibc/A7CBAF118AC24A896DC46A098FE9FA2A588A36A2F0239913229D3A11D92E7B2E",
        },
      ],
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};
send_message_evm();
