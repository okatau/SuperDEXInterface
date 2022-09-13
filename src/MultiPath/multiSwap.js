import IParaSwap from '../abi/IParaSwap.json'
import { ethers, BigNumber } from "ethers";
// const Web3 = require("web3")
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
    return ethers.utils.defaultAbiCoder.encode(
      [
        'address', 'uint256[]'
      ], 
      [
        "0xae13d989dac2f0debff460ac112a837c89baa7cd", //    'адрес weth',
        [helper(true, "0x38393334862fFa91e9aB802BCD3AF14afA67C688", 9970)]
      ]
    );
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
    //     try {
    //         console.log(chain, AugustusSwapperAddress[chain]);
    //         console.log("try Swap");
    //         const options = {value: ethers.utils.parseEther((0.01).toString())};
    //         const fee = ethers.utils.parseEther((0.05).toString()); 
    //         const amount = ethers.utils.parseEther((amountIn).toString()); 
    //         const minOut = ethers.utils.parseEther((amountOutMin).toString()); 
    //         let response = await contract.swapOnMultiPathDeBridge([amount, minOut, before, after, receiver, fee, chain], options);
    //         console.log("response: ", response);
    //     } catch (err) {
    //       console.log("error: ",err);
    //     }
    }
}
