import { ethers, BigNumber } from "ethers";
import UniswapV2PairABI from '../abi/UniswapV2PairABI.json';
import IParaSwap from './../abi/IParaSwap.json'

const targetNetworkId = ['0x61', '0x13881'];
const chainID = {"0x61": 97, "0x13881": 80001};
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

async function packPools(path, tokenIn){
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        var pools = []
        let tokenAfterSwap = tokenIn;
        for (var i = 0; i < path.length; i++){
            console.log(path[i]);
            const contract = new ethers.Contract(path[i], UniswapV2PairABI, signer);
            let direction = await contract.token0() == tokenAfterSwap;
            tokenAfterSwap = direction ? await contract.token1() : await contract.token0();
            pools.push(helper(direction, path[i], 9970))
            console.log("packPools", i, tokenAfterSwap);
        }
        return pools;
    }
}


export async function SwapUniswap(amountIn, amountOutMin, pairListBefore, pairListAfter, tokenInBefore, tokenInAfter, receiver){
    let chain = await setDestinationNet();
    var before=[]
    for (var i in pairListBefore){
        before.push(pairListBefore[i]['address']);
    }     
    var after=[]
    for (var i in pairListAfter){
        after.push(pairListAfter[i]['address']);
    } 
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          AugustusSwapperAddress[chain],
          IParaSwap,
          signer
        );
        try {
            console.log(chain, AugustusSwapperAddress[chain]);
            console.log("try Swap");
            let deBridgeFee = chain == 80001 ? ethers.utils.parseEther((0.01).toString()) : ethers.utils.parseEther((0.1).toString());
            const options = {value: deBridgeFee};
            const fee = ethers.utils.parseEther((0.05).toString()); 
            amountIn = ethers.utils.parseEther((amountIn).toString()); 
            amountOutMin = ethers.utils.parseEther((amountOutMin).toString());
            let beneficiary;
            
            if (receiver == ethers.constants.AddressZero){
                beneficiary = await signer.getAddress();
            } else {
                beneficiary = receiver;
            }
            
            let poolsBeforeSend = await packPools(before, tokenInBefore);
            await switchNetwork();
            let poolsAfterSend = await packPools(after, tokenInAfter);
            await switchNetwork();
            // console.log("Test");
            // console.log("TokenIn, TokenIn -", tokenInBefore, tokenInAfter,
            //      "\namountIn -", amountIn,
            //      "\nAmountOutMin -", amountOutMin,
            //      "\nweth -", ethers.constants.AddressZero,
            //      "\npoolsBefore -", poolsBeforeSend,
            //      "\npools after -", poolsAfterSend,
            //      "\nfee -", fee,
            //      "\nchain -", chain,
            //      "\nreceiver -", beneficiary);

            let response = await contract.swapOnUniswapV2ForkDeBridge([
                [tokenInBefore, tokenInAfter],
                amountIn, 
                amountOutMin, 
                ethers.constants.AddressZero, 
                poolsBeforeSend,
                poolsAfterSend,
                fee, 
                chain, 
                beneficiary], 
                options
            );
            console.log("response: ", response);
        } catch (err) {
          console.log("error: ",err);
        }
    }
}