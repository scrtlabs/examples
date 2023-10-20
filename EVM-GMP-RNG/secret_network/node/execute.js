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
  "3db2def07511bdb6bb2c22be7d9649a3601f364ccd835dc15b2f964687b94a53";
let contractAddress = "secret1wu6j02kp7stztwanzrtha5cy0ex3gsffz4p2t9";

//send_message_evm variables
let destinationChain = "Polygon";
let destinationAddress = "0xf60E43AD3953c5e2B846A80D73Dc5bf1Eaa4E497";

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
