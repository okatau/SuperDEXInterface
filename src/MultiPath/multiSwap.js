import IParaSwap from '../abi/IParaSwap.json'
import { ethers, BigNumber } from "ethers";
// const Web3 = require("web3")
import {useState} from 'react'
// import Web3 from 'web3';


// const web3 = new Web3("http://lweb3 doesn't work jsocalhost:8545")
const chainID = {"0x62": 97, "0x13881": 80001};
const AugustusSwapperAddress = {80001:"0x38582841f43D41e71C9b3A46B61aD79D765432AF", 
                                97:"0xe0073335c740ed1589aa20b1360c673f9196985b"};

function helper(direction, pair, fee){
    if (direction) {
        return (ethers.BigNumber.from(ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161))).add(ethers.BigNumber.from(pair))).toString();
    } else {
        return (ethers.BigNumber.from(ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161))).add(ethers.BigNumber.from(pair)).sub(ethers.BigNumber.from("1461501637330902918203684832716283019655932542976"))).toString();
    }             
}    

function encodeParams(){
    // return web3.abi.encodeParameter(
    //   [
    //     'address', 'uint256[]'
    //   ], 
    //   [
    //     "0xae13d989dac2f0debff460ac112a837c89baa7cd", //    'адрес weth',
    //     [helper(true, "0x38393334862fFa91e9aB802BCD3AF14afA67C688", 9970)]
    //   ]
    // );
  //   return (
  //       web3.eth.abi.encodeParameter(
  //       {
  //           "UniswapV2Data": {
  //               "weth": 'address',
  //               "pools": 'uint256[]'
  //           }
  //       },
  //       {
  //           "weth": 'адрес weth',
  //           "pools": ['числовое значение, которое мы получили выше, если обмен состоит из нескольких токенов, то указать другие числовые значения как массив'],
  //       }
  //     )
  // );
}

export async function setDestinationNet(){
    if (window.ethereum) {
        let currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        if (chainID[currentChainId] == 80001){
            return 97;
        } else {
            return 80001;
        }
    }
}

export async function multiSwap(amountIn, amountOutMin, sourceToken, destinationToken, receiver){
    let chain = await setDestinationNet();
    // var before=[]
    // for (var i in inputListBefore){
    //     before.push(inputListBefore[i]['address']);
    // }     
    // var after=[]
    // for (var i in inputListAfter){
    //     after.push(inputListAfter[i]['address']);
    // } 
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          AugustusSwapperAddress[chain],
          IParaSwap,
          signer
        );
    console.log(helper(true, "0x38393334862fFa91e9aB802BCD3AF14afA67C688", 9970));
    console.log(encodeParams());
    
    // -------------make Params for swap
    // const adapter = "0x63eEAdEA8BB764FD5cF26a4E7f11Ea4fFdBCc44C";
    // const startDestToken =  "0x3f951798464b47e037fAF6eBAb337CB07F5e16c9";
    // const percent = 10000;

    // const baseData = [sourceToken, destinationToken], amountIn, amountOutMin, receiver;
    const payloadSource = "0x00";
    const helpAdapterSource = [[4, "0x0000000000000000000000000000000000000000", 10000, payloadSource, 0]];
    const adapterSource = [["0x63eEAdEA8BB764FD5cF26a4E7f11Ea4fFdBCc44C", 10000, 0, helpAdapterSource]];
    const swapSource = [["0x3f951798464b47e037fAF6eBAb337CB07F5e16c9", 0 , adapterSource]];


    const payloadDest = "0x00";
    const helpAdapterDest = [[4, "0x0000000000000000000000000000000000000000", 10000, payloadDest, 0]];
    const adapterDest = [["0xE2454708A0918D899bB5b2658Bd3E8655E37316C", 10000, 0, helpAdapterDest]];
    const swapDest = [["0x7bcE539216d7E2cB1270DAA564537E0C1bA3F356", 0 , adapterDest]];

    const swapData = [
      [sourceToken, destinationToken], 
      amountIn, 
      amountOutMin, 
      receiver,
          swapSource,
          swapDest,
      receiver,
      "452312848583266388373324160190187140051835877600158453279131187530910679040",
      "0x00",
      1686061732,
      "0x48726217fca940b892b3b899843c8a57",
      50000000000000000,
      80001
    ];
        try {
            console.log(chain, AugustusSwapperAddress[chain]);
            console.log("try Swap");
            const options = {value: ethers.utils.parseEther((0.01).toString())};
            let response = await contract.multiSwapDeBridge(swapData, options);
            console.log("response: ", response);
        } catch (err) {
          console.log("error: ",err);
        }
    }
}
