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
  "f2e21a5ee09296464248a293f4050979d7c76a2e9a8a293e24c95632808d3c6b";
let contractAddress = "secret1fez27f578vuqprd73p08v65vntq2apg9rjdax7";

//send_message_evm variables
let destinationChain = "Polygon";
let destinationAddress = "0xf3431487fd737ec32279333987b1D7fBdB2faD91";

let send_message_evm = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        send_message_evm: {
          destination_chain: destinationChain,
          destination_address: destinationAddress,
        },
      },
      code_hash: contractCodeHash,
      sent_funds: [
        {
          amount: "250000",
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
