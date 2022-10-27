import { ethers, BigNumber } from "ethers";
import UniswapV2PairABI from '../abi/UniswapV2PairABI.json';

function helper(direction, pair, fee){
    if (direction) {
        return ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161)).add(ethers.BigNumber.from(pair)).toString();
    } else {
        return (ethers.BigNumber.from(ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161))).add(ethers.BigNumber.from(pair)).sub(ethers.BigNumber.from("1461501637330902918203684832716283019655932542976"))).toString();
    }             
} 

export async function packPools(path, tokenIn, signer){
    var pools = []
    let tokenAfterSwap = tokenIn;
    for (var i = 0; i < path.length; i++){
        console.log(path[i]);
        const pairContract = new ethers.Contract(
            path[i],
            UniswapV2PairABI,
            signer
        )
        let direction = tokenAfterSwap == await pairContract.token0();
        tokenAfterSwap = direction ? await pairContract.token1() : await pairContract.token0();
        pools.push(helper(direction, path[i], 9970))
        console.log("packPools", i, tokenAfterSwap);
    }
    return pools;
}