import IParaSwap from '../abi/IParaSwap.json'
import { ethers } from "ethers";
const Web3EthAbi = require('web3-eth-abi');
const swapData = require("./swapData.json")
const chainID = {"0x62": 97, "0x13881": 80001};
const AugustusSwapperAddress = {80001:"0x38582841f43D41e71C9b3A46B61aD79D765432AF", 
                                97:"0xe0073335c740ed1589aa20b1360c673f9196985b"};
  
const weth = {
  97: "0x0000000000000000000000000000000000000000",
  80001: "0x0000000000000000000000000000000000000000"
}


function helper(direction, pair, fee){
    if (direction) {
        return ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161)).add(ethers.BigNumber.from(pair)).toString();
    } else {
        return (ethers.BigNumber.from(ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161))).add(ethers.BigNumber.from(pair)).sub(ethers.BigNumber.from("1461501637330902918203684832716283019655932542976"))).toString();
    }             
}    

async function encodeParams(pair){
  let chain = await setDestinationNet(); 
  let encode = await Web3EthAbi.encodeParameter(
    {
      "UniswapV2Data": {
        "weth": 'address',
        "pools": 'uint256[]'
      }
    },
    {
      "weth": weth[chain],
      "pools": [helper(false, pair, 9970)]
    }
  );
  return encode.toString();
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

function parseInpustList(inputList){
  var list = [];
  for (var i in inputList){
    list.push(inputList[i].address.replaceAll(" ", "").replaceAll('"', '').split(","));
  } 
  return list;
}

async function swapsInfo(list){
  console.log(list);
  var swaps = []
  for (var i in list){
    let payload = await encodeParams(list[i][2]);
    var swap = [
      list[i][0], 0, [[
        list[i][1], 10000, 0, [[
          4, "0x0000000000000000000000000000000000000000", 10000,
          payload, 0
        ]]
      ]]
    ];
    swaps.push(swap);
  }
  return swaps;
}

async function packData(amountIn, amountOutMin, sourceToken, destinationToken, receiver, before, after, chain){
  // let helpAmount = amountOutMin.replace(1, "1");
  // helpAmount.replace(1, "1");
  // console.log(helpAmount);
  var data = [
      [sourceToken, destinationToken], amountIn, amountOutMin, "3100000000000000000",
      "0x687FA78988BCfDBB8C3FECB9cE66672F7651EDe1",
      before, after,
      "0x0000000000000000000000000000000000000000", 
      "452312848583266388373324160190187140051835877600158453279131187530910679040", 
      "0x00", 
      1686061732, 
      "0x48726217fca940b892b3b899843c8a57", 
      "50000000000000000", 
      chain.toString()
    ] 
    return data;
}

async function collectData(amountIn, amountOutMin, sourceToken, destinationToken, receiver, inputListBefore, inputListAfter){
  let chain = await setDestinationNet();
  amountIn = ethers.utils.parseEther(amountIn).toString();
  amountOutMin = ethers.utils.parseEther(amountOutMin).toString();
  let before = await swapsInfo(parseInpustList(inputListBefore));
  let after = await swapsInfo(parseInpustList(inputListAfter));
  let data = await packData(amountIn, amountOutMin, sourceToken, destinationToken, receiver, before, after, chain);
  return data;
}

function different(d1, d2){
  if (d1 != d2){
    for (var i in d1){
      if (d1[i] != d2[i]){
        console.log(d1[i], d2[i]);
      }
    }
  }
}

export async function multiSwap(amountIn, amountOutMin, sourceToken, destinationToken, receiver, inputListBefore, inputListAfter){
    let chain = await setDestinationNet();
    let data = await collectData(amountIn, amountOutMin, sourceToken, destinationToken, receiver, inputListBefore, inputListAfter);
    if (data[5][0][2][0][3][0][3] != swapData["1"][5][0][2][0][3][0][3]){
      console.log("Generated before data: \t", data[5][0][2][0][3][0][3]);
      console.log("Correct before data: \t", swapData["1"][5][0][2][0][3][0][3]);  
    }
    if (data[6][0][2][0][3][0][3] != swapData["1"][6][0][2][0][3][0][3]){
      console.log("Generated before data: \t", data[6][0][2][0][3][0][3]);
      console.log("Correct before data: \t", swapData["1"][6][0][2][0][3][0][3]);  
    }
    console.log("Equal: ", swapData["1"] == data);
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          AugustusSwapperAddress[chain],
          IParaSwap,
          signer
        );
        try {
            const options = {value: ethers.utils.parseEther((0.01).toString())};
            // const data = swapData["1"];
            let response = await contract.multiSwapDeBridge(data, options);
            console.log("response: ", response);
        } catch (err) {
          console.log("error: ",err);
        }
    }
}