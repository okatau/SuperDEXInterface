import { ethers, BigNumber } from "ethers";
function helper(direction, pair, fee){
    if (direction) {
        return ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161)).add(ethers.BigNumber.from(pair)).toString();
    } else {
        return (ethers.BigNumber.from(ethers.BigNumber.from(fee).mul(ethers.BigNumber.from(2).pow(161))).add(ethers.BigNumber.from(pair)).sub(ethers.BigNumber.from("1461501637330902918203684832716283019655932542976"))).toString();
    }             
} 

export async function packPools(path){
    var pools = []
    for (var i = 1; i < path.length; i++){
        pools.push(helper(false, path[i], 9970))
    }
    return pools;
}