const hre = require("hardhat");

async function main() {
  let SendReceiveEncryptFactory = await hre.ethers.getContractFactory(
    "SendReceiveEncrypt"
  );
  let sendreceiveencrypt = await SendReceiveEncryptFactory.deploy(
    "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B", // axelar gateway
    "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6", // axelar gas service
    "Polygon" // chain name
  );

  console.log("SendReceiveEncrypt deployed to: ", sendreceiveencrypt.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
