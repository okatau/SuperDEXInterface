import TSM from "../../abi/ITSM.json";
const hre = require("hardhat");

const TSMAddress = "0x25be9d241171529f63C53004Ee19302866063338";

const hre = require("hardhat");

async function main(_addr) {
//   const TSM = await hre.ethers.getContractFactory("TSM");
//   const tsm = await TSM.deploy('0x529A234c998fEbB3ef47d4FB7B7F0a37611b7878');

  await tsm.deployed();

  console.log("TSM deployed to:", tsm.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(_addr).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});