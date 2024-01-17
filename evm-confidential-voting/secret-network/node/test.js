const { SecretNetworkClient, Wallet } = require("secretjs");
const dotenv = require("dotenv");
dotenv.config({ path: "../../polygon/.env" });

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash = process.env.CODE_HASH;
let contractAddress = process.env.SECRET_ADDRESS;
let other_public_key = process.env.ECC_PUBLIC_KEY.split(",").map((num) =>
  parseInt(num, 10)
);

let decrypt = async (encrypted_votes) => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        decrypt_tally: {
          public_key: other_public_key,
          encrypted_message: encrypted_votes,
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 2_000_000 }
  );

  console.log(tx);
};

decrypt([
  "0x60a9789ef73642613888a62e79ea6a54c45bb7333e15b7a3f16b12cf36b59265538dd6839f74e519333648d01353a58b48fef448a727f679888c6b7a00ed05addf20a975caff9479cef2200fee0a1d6861b81a41a5e00ae6a9cc4b3acbbcfea0271f6587ef6cbaf0594de5173501adf77c1b09a1a491063f47",
  "0x284fc76c7dfba05fcf40e11ffe1619e4ad06adc2efe260e2516bc5b7e6e1a069ed7c4be26a0c783479b82c96ffa4c9fc658f51ce061d77fbde8de2e2236770d2a7c455e885816c8d0c10480f785a710ccd4a9cf15aca8b25dfa1a2a38d483cd2006861f5e5a732fabd1599923eb909ff05b057b71169151bcd",
]);
