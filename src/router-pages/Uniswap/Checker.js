import IParaswap from './../../abi/IParaSwap.json'
import { ethers, BigNumber } from "ethers";

const AugustusSwapperAddress = "0x20A1Da6cC0735955bC66B12e13f13493afE74A23";

async function swapUniswap(amountIn, amountOutMin, before, receiver, after) {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        AugustusSwapperAddress,
        IParaswap.abi,
        signer
      );

    //   console.log([amountIn, amountOutMin, before, after, receiver, fee, 42]);
      console.log('options');
      const options = {value: ethers.utils.parseEther((0.01).toString())};
      console.log(options);
    const fee = ethers.utils.parseEther((50000000000000000).toString()); 

      try {
        let response = await contract.swapOnUniswapDeBridge([amountIn, amountOutMin, before, after, receiver, fee, 42], options);
        return ("response: ", response);
      } catch (err) {
        console.log("error: ");
      }
    }
  }

export function SwapUniswap(amountIn, amountOutMin, inputListBefore, receiver, inputListAfter){
    var before=[]
    for (var i in inputListBefore){
        before.push(inputListBefore[i]['address']);
    }     
    var after=[]
    for (var i in inputListAfter){
        after.push(inputListAfter[i]['address']);
    } 
    swapUniswap(amountIn, amountOutMin, before, receiver, after);
}