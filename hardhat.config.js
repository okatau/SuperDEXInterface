require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require("dotenv")

dotenv.config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: ['fab889d11f9b42342fa1aa981f4c17655b0b6c7b9be02a9d74c6bcd5bb3fdc59']
    }
    // etherscan: {
    //   apiKey: process.env.REACT_APP_ETHERSCAN_KEY
    // }
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}

// TSM 0x7Ea3D9c38723E4A5bC5c140554584cbFA1e8a8B5