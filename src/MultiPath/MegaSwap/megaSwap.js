import { ethers } from "ethers";
import UniswapV2PairABI from "../../abi/UniswapV2PairABI.json";
import IParaSwap from "../../abi/IParaSwap.json";

const Web3EthAbi = require('web3-eth-abi');
const swapData = require("./MegaswapData.json");

const chainID = {"0x62": 97, "0x13881": 80001};
const targetNetworkId = ['0x61', '0x13881'];
const weth = {
    97: "0x0000000000000000000000000000000000000000",
    80001: "0x0000000000000000000000000000000000000000"
}
const AugustusSwapperAddress = {
    80001:"0x38582841f43D41e71C9b3A46B61aD79D765432AF", 
    97:"0xe0073335c740ed1589aa20b1360c673f9196985b"
};

const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      console.log(currentChainId);
      return [Boolean(currentChainId == targetNetworkId[0] | currentChainId == targetNetworkId[1]), currentChainId];
    }
}

async function switchNetwork(){
    let currentNet = await checkNetwork();
        console.log("currenet net", currentNet);
        if (currentNet[1] == targetNetworkId[0]){
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetworkId[1] }],
              });      
        }
        else{
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetworkId[0] }],
            });
        }
}

async function setDestinationNet(){
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

function helper(direction, pair, fee){
    if (direction) {
        return ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161)).add(ethers.BigNumber.from(pair)).toString();
    } else {
        return (ethers.BigNumber.from(ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161))).add(ethers.BigNumber.from(pair)).sub(ethers.BigNumber.from("1461501637330902918203684832716283019655932542976"))).toString();
    }             
}   

async function encodeParams(pair, direction){
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
        "pools": [helper(direction, pair, 9970)]
      }
    );
    return encode.toString();
  }

function parseList(_list){
    let list = [];
    for(var i in _list){
        list.push(_list[i].address.replace( /\s/g, "").split(','));
    }
    return list;
}

async function swapInfo(dataList, percentList){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let swaps = [];
        for(let i in dataList){
            const contract = new ethers.Contract(dataList[i][1], UniswapV2PairABI, signer);
            let direction = !(await contract.token0() == dataList[i][0]);
            let payload = await encodeParams(dataList[i][1], direction);
            let swap = [
                dataList[i][0],
                0,
                [[
                    dataList[i][2],
                    10000,
                    0,
                    [[
                        4,
                        ethers.constants.AddressZero,
                        10000,
                        payload,
                        0
                    ]]
                ]]
            ];
            swaps.push(swap);
        }
        let finishList = [];
        let lastCut = 0;
        for(let i in percentList){
            let temp = [
                percentList[i].percent * 100,
                swaps.slice(lastCut, percentList[i].perList)
            ];
            finishList.push(temp);
        }
        return finishList;
    }
}

async function packData(amountIn, amountOutMin, sourceToken, destinationToken, receiver, listBefore, listAfter, chain){
    let data = [
        [sourceToken, destinationToken],
        amountIn,
        amountOutMin,
        ethers.BigNumber.from(10).pow(17).add(amountOutMin),
        "0x687FA78988BCfDBB8C3FECB9cE66672F7651EDe1",
        listBefore,
        listAfter,
        ethers.constants.AddressZero,
        "452312848583266388373324160190187140051835877600158453279131187530910679040",
        "0x00",
        1686061732,
        "0x48726217fca940b892b3b899843c8a57",
        ethers.utils.parseEther("0.05"),
        chain.toString()
    ];
    return data;
}

async function collectData(
    sourceToken, 
    destinationToken, 
    amountIn, 
    amountOutMin, 
    megaSwapPathPercentBefore, 
    megaSwapPathPercentAfter, 
    inputListBefore, 
    inputListAfter, 
    receiver, 
    chain){
    amountIn = ethers.utils.parseEther(amountIn.toString());
    amountOutMin = ethers.utils.parseEther(amountOutMin.toString());
    let listBefore = await swapInfo(parseList(inputListBefore), megaSwapPathPercentBefore);
    await switchNetwork();
    let listAfter = await swapInfo(parseList(inputListAfter), megaSwapPathPercentAfter);
    await switchNetwork();
    let data = await packData(amountIn, amountOutMin, sourceToken, destinationToken, receiver, listBefore, listAfter, chain);
    return data;
}

export async function megaSwapCrosschain(
    sourceToken, 
    destinationToken, 
    amountIn, 
    amountOutMin, 
    megaSwapPathPercentBefore, 
    megaSwapPathPercentAfter, 
    inputListBefore, 
    inputListAfter, 
    receiver){
    let chain = await setDestinationNet();
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let data = await collectData(sourceToken, destinationToken, amountIn, amountOutMin, megaSwapPathPercentBefore, megaSwapPathPercentAfter, inputListBefore, inputListAfter, receiver, chain);
        let deBridgeFee = chain == 80001 ? ethers.utils.parseEther((0.01).toString()) : ethers.utils.parseEther((0.1).toString());
        // console.log("here");
        // console.log(chain);
        // console.log(deBridgeFee);
        console.log(data);
        const contract = new ethers.Contract(
            AugustusSwapperAddress[chain],
            IParaSwap,
            signer
        );
        try {
            const options = {value: deBridgeFee};
            let response = await contract.megaSwapDeBridge(data, options);
            console.log("response: ", response);
        } catch (err) {
          console.log("error: ",err);
        }
    }
}
