import { ethers, BigNumber } from "ethers";
import PayloadABI from "../abi/PayloadABI.json"
import IParaSwap from './../abi/IParaSwap.json'

const PayloadAddress = "0x0C580D4ac2bA0484cAFE92921A4eea464E6501e8";
const AugustusSwapperAddress = {
    80001:"0x38582841f43D41e71C9b3A46B61aD79D765432AF", 
    97:"0x61F417C743afed21a8813c6b15a6D026D4EeA419"
};
const chainID = {"0x62": 97, "0x13881": 80001};

async function setDestinationNet(){
    if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        if (chainID[currentChainId] == 80001){
            return 97;
        } else {
            return 80001;
        }
    }
}

async function payload(data){
    console.log("payload");
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            PayloadAddress,
            PayloadABI,
            signer
        );
    try {
        let response = await contract.encodePayload(data);
        console.log(response);
        return (response);
    } catch (err) {
        console.log("error: ");
        }
    }
}

async function getPayload(
    amount,
    makerToken,
    takerToken,
    receiver,
    chain
){
    let timestamp;
    if (window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let block = await provider.getBlockNumber();
        timestamp = (await provider.getBlock(block)).timestamp + 10000;
        console.log("block.timastamp + 10000 =", timestamp);
    }  
    let data = [[
        [
            makerToken,
            takerToken,
            amount,
            amount,
            "0x687FA78988BCfDBB8C3FECB9cE66672F7651EDe1",
            AugustusSwapperAddress[chain],
            receiver,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            ethers.BigNumber.from(timestamp),
            ethers.BigNumber.from(1659700605000)
        ],
        [
            "3",
            "28",
            "0xf29ce1b13dc01ca4f4391d4f8774d002b294924142841655f21c70cc533544e6",
            "0x4d5c48a4d0ce035d6b78354c3942c1f824c7068be7ae54988ddc02fbb55acb62"
        ]
    ]];
    let abi = ethers.utils.defaultAbiCoder;

    let encodeData = abi.encode(
        ["tuple(tuple(address, address, uint128, uint128, address, address, address, bytes32, uint64, uint256), tuple(uint256, uint8, bytes32, bytes32))"], 
        data
    );
    console.log(encodeData);
    return encodeData;
}

async function collectData(amountIn, amountOutMin, sourceTokenBefore, destinationTokenBefore, sourceTokenAfter, destinationTokenAfter, receiver, chain) {
    amountIn = ethers.utils.parseEther(amountIn.toString());
    amountOutMin = ethers.utils.parseEther(amountOutMin.toString());

    let payloadBefore = await getPayload(amountIn, destinationTokenBefore, sourceTokenBefore, receiver, chain);
    let secondChain = chain == 97 ? 80001 : 97;
    //Тут должна быть функция которая считает значение amountIn после бриджа
    let payloadAfter = await getPayload(amountIn, destinationTokenAfter, sourceTokenAfter, receiver, secondChain);
    let data = [
        [sourceTokenBefore, destinationTokenBefore],
        [sourceTokenAfter, destinationTokenBefore],
        amountIn,
        amountOutMin,
        "0x778c6702e2fd52a3F47715e3aca9F8C5cC57787A",
        "0x7345cd6D972EFa303ec6ed5bBC57753964D0600B",
        payloadBefore,
        payloadAfter,
        receiver,
        ethers.utils.parseEther((0.05).toString()),
        chain
    ];
    return data;
}

export async function SwapZerox(amountIn, amountOutMin, sourceTokenBefore, destinationTokenBefore, sourceTokenAfter, destinationTokenAfter, receiver){
    let chain = await setDestinationNet();
    let data = await collectData(amountIn, amountOutMin, sourceTokenBefore, destinationTokenBefore, sourceTokenAfter, destinationTokenAfter, receiver, chain);
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          AugustusSwapperAddress[chain],
          IParaSwap,
          signer
        );
        try {
            console.log("try Swap");
            let deBridgeFee = chain == 80001 ? ethers.utils.parseEther((0.01).toString()) : ethers.utils.parseEther((0.1).toString());
            const options = {value: deBridgeFee};
            console.log("here");
            let response = await contract.swapOnZeroXv4DeBridge(data, options);
            console.log("response: ", response);
        } catch (err) {
          console.log("error: ",err);
        }
    }
}

