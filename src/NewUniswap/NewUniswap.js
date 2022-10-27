import{ useState, form } from 'react';
// import styled from "styled-components";

import './NewUniswap.css';
// import {SwapUniswap} from './Checker';

import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import IParaSwap from './../abi/IParaSwap.json'
import { ethers, BigNumber } from "ethers";
import { packPools } from './helpModule';

const AugustusSwapperAddress = {80001:"0x38582841f43D41e71C9b3A46B61aD79D765432AF", 
                                97:"0xe0073335c740ed1589aa20b1360c673f9196985b"};
const weth = {
  97: "0x0000000000000000000000000000000000000000",
  80001: "0x0000000000000000000000000000000000000000"
}
function NewUniswap({}){
    const [pairListBefore, setPairListBefore] = useState([
        {address: "0x38393334862fFa91e9aB802BCD3AF14afA67C688"}, 
    ]);
    const [pairListAfter, setPairListAfter] = useState([
        {address: "0xC3d71bD825A9F00A48dF65824e974c03ab1355d0"}, 
    ]);
    const [amountIn, setAmountIn] = useState('1');
    const [amountOutMin, setAmountOutMin] = useState('0.5');
    const [tokenInBefore, setTokenInBefore] = useState('0x8475318Ee39567128ab81D6b857e7621b9dC3442');
    const [tokenInAfter, setTokenInAfter] = useState('0xC75E8e8E14F370bF25ffD81148Fd16305b6aFba6');
    const [_chainIdTo, setChainIdTo] = useState('');
    const [receiver, setReceiver] = useState(ethers.constants.AddressZero);
    const [isCrossChainSwap, setIsCrosschainSwap] = useState(true);
    const chainID = {"0x62": 97, "0x13881": 80001};
    

    const handleInputChangeBefore = (e, index) => {
        const { name, value } = e.target;
        const list = [...pairListBefore];
        list[index][name] = value;
        setPairListBefore(list);
    };
    const handleInputChangeAfter = (e, index) => {
        const { name, value } = e.target;
        const list = [...pairListAfter];
        list[index][name] = value;
        setPairListAfter(list);
    };
    
    const handleRemoveClickBefore = index => {
        const list = [...pairListBefore];
        list.splice(index, 1);
        setPairListBefore(list);
    };
    const handleRemoveClickAfter = index => {
        const list = [...pairListAfter];
        list.splice(index, 1);
        setPairListAfter(list);
    };

    const handleAddClickAfter = () => {
        setPairListAfter([...pairListAfter, { address: ""}]);
    };

    const handleAddClickBefore = () => {
        setPairListBefore([...pairListBefore, { address: ""}]);
    };

    const setTypeSwap = () => {
        let value = document.getElementById("swapType").value;
        console.log(isCrossChainSwap);
        if(value == "One chain swap"){
            setIsCrosschainSwap(false);
            return;
        }
        setIsCrosschainSwap(true);
        return;
    }

    async function Submit(){ 
        SwapUniswap(amountIn, amountOutMin, pairListBefore, pairListAfter); 
    }

    async function SwapUniswap(amountIn, amountOutMin, pairListBefore, pairListAfter){
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
                const options = {value: ethers.utils.parseEther((0.01).toString())};
                const fee = ethers.utils.parseEther((0.05).toString()); 
                const amount = ethers.utils.parseEther((amountIn).toString()); 
                const minOut = ethers.utils.parseEther((amountOutMin).toString());
                let beneficiary;
                
                if (receiver == ethers.constants.AddressZero){
                    beneficiary = await signer.getAddress();
                } else {
                    beneficiary = receiver;
                }
                
                let poolsBeforeSend = await packPools(before, tokenInBefore, signer);
                // let poolsAfterSend = await packPools(after, tokenInBefore, signer);
                console.log("Test");
                // console.log(beneficiary);
                // console.log(poolsAfterSend);
                // console.log(before[0]);
                // let response = await contract.swapOnUniswapV2ForkDeBridge([
                //     [tokenInBefore, tokenInAfter],
                //     amount, minOut, 
                //     "0x0000000000000000000000000000000000000000", 
                //     poolsBeforeSend,
                //     poolsAfterSend,
                //     fee, chain, beneficiary], options);
                // console.log("response: ", response);
            } catch (err) {
              console.log("error: ",err);
            }
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

    return (
    <div>
        <div>
            <select id='swapType' onChange={setTypeSwap}>
                <option>Crosschain swap</option>
                <option>One chain swap</option>
            </select>
        </div>
        {isCrossChainSwap ?
            <div>
            <div>
                <Text>
                    Uniswap Crosschain Swap
                </Text>
            </div>
            <div>
                <Input
                    placeholder="Amount In"
                    variant="outlined"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    text='Amount of token you want to swap'
                    type="number"
                    step="0.5"
                />
            </div><div>
            <Input
                    placeholder="Amount Out Min"
                    variant="outlined"
                    value={amountOutMin}
                    onChange={(e) => setAmountOutMin(e.target.value)}
                    text='Minimum amount of token you want to get back'
                    type="number"
                    step="0.5"
                />
            </div><div>
            <Input
                    placeholder="Token in before bridge"
                    variant="outlined"
                    value={tokenInBefore}
                    onChange={(e) => setTokenInBefore(e.target.value)}
                    text='First token in path before bridge'
                    type="text"
                /> 
            </div><div>
            <Input
                    placeholder="Token in after bridge"
                    variant="outlined"
                    value={tokenInAfter}
                    onChange={(e) => setTokenInAfter(e.target.value)}
                    text='First token in path after bridge'
                    type="text"
                /> 
            </div><div>
            {pairListBefore.map((x, i) => {
                return (
                <div className="box" id = 'inputPathBeforeSend' align = 'center'>
                    <input
                        name="address"
                        id = 'address'
                        type='text'
                        placeholder="Enter pair address before send"
                        value={x.address}
                        onChange={e => handleInputChangeBefore(e, i)}
                    />
                        {pairListBefore.length !== 1 && <Button className = 'newUniswapCustomChkraButton'
                        onClick={() => handleRemoveClickBefore(i)}>Sub</Button>}
                        {pairListBefore.length - 1 === i && <Button className = 'newUniswapCustomChkraButton' onClick={handleAddClickBefore}>Add</Button>}
                </div>
            );
            })}

            </div><div>
            {pairListAfter.map((x, i) => {
                return (
                <div className="box" id = 'inputPathAfterSend' align = 'center'>
                    <input
                        name="address"
                        id = 'address'
                        type='text'
                        placeholder="Enter pair address after send"
                        value={x.address}
                        onChange={e => handleInputChangeAfter(e, i)}
                    />
                        {pairListAfter.length !== 1 && <Button className = 'newUniswapCustomChkraButton'
                        onClick={() => handleRemoveClickAfter(i)}>Sub</Button>}
                        {pairListAfter.length - 1 === i && <Button className = 'newUniswapCustomChkraButton' onClick={handleAddClickAfter}>Add</Button>}
                </div>
            );
            })}
            </div><div>
            <input
                placeholder="_receiver"
                variant="outlined"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                text='Token receiver'
                type='text'
            />    
            </div>
            <Button className = 'newUniswapCustomChkraButton'
            onClick={Submit}>
                Swap
            </Button>
        </div> :
        <div></div>}
    </div>
    );
}

export default NewUniswap;
