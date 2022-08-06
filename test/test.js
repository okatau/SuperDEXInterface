const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("test", function (){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      TokenAddress,
      Token.abi,
      signer
    );
    try {
      const response = contract.totalSupply();
      return (response.toString());
    } catch (err) {
      console.log( "error");
    }
  }