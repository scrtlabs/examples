require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: ["0x" + process.env.PRIVATE_KEY],
    },
  },
};
