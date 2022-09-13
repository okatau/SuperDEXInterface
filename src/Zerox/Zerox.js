import{ useState, form } from 'react';

import './Zerox.css';

import {payload} from './payload.js'
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import IParaSwap from './../abi/IParaSwap.json'
import { ethers, BigNumber } from "ethers";

const AugustusSwapperAddress = {80001:"0x38582841f43D41e71C9b3A46B61aD79D765432AF", 
                                97:"0x61F417C743afed21a8813c6b15a6D026D4EeA419"};

function Zerox({}){
    const [inputListBefore, setInputListBefore] = useState([{ address: ""}]);
    const [inputListAfter, setInputListAfter] = useState([{ address: ""}]);
    const [amountIn, setAmountIn] = useState('');
    const [amountOutMin, setAmountOutMin] = useState('');
    const [_chainIdTo, setChainIdTo] = useState('');
    const [receiver, setReceiver] = useState('');
    const chainID = {"0x62": 97, "0x13881": 80001};
    const [dataPyload, setDataPayload] = useState('');
    

    const handleInputChangeBefore = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputListBefore];
        list[index][name] = value;
        setInputListBefore(list);
    };
    const handleInputChangeAfter = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputListAfter];
        list[index][name] = value;
        setInputListAfter(list);
    };
    
    const handleRemoveClickBefore = index => {
        const list = [...inputListBefore];
        list.splice(index, 1);
        setInputListBefore(list);
    };
    const handleRemoveClickAfter = index => {
        const list = [...inputListAfter];
        list.splice(index, 1);
        setInputListAfter(list);
    };

    const handleAddClickAfter = () => {
        setInputListAfter([...inputListAfter, { address: ""}]);
    };

    const handleAddClickBefore = () => {
        setInputListBefore([...inputListBefore, { address: ""}]);
    };

    async function Submit(){ 
        SwapZerox(amountIn, amountOutMin, inputListBefore, receiver, inputListAfter); 
    }

    async function SwapZerox(amountIn, amountOutMin, inputListBefore, receiver, inputListAfter, signer){
        let chain = await setDestinationNet();
        var before=[]
        for (var i in inputListBefore){
            before.push(inputListBefore[i]['address']);
        }     
        var after=[]
        for (var i in inputListAfter){
            after.push(inputListAfter[i]['address']);
        } 
        console.log([amountIn, amountOutMin, inputListBefore, receiver, inputListAfter]);
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
                const options = {value: ethers.utils.parseEther((0.01).toString())};
                const fee = ethers.utils.parseEther((0.05).toString()); 
                const amount = ethers.utils.parseEther((amountIn).toString()); 
                const minOut = ethers.utils.parseEther((amountOutMin).toString()); 
                console.log("fee", fee);
                let response = await contract.swapOnZeroxDeBridge([amount, minOut, before, after, receiver, fee, chain], options);
                console.log("response: ", response);
            } catch (err) {
              console.log("error: ",err);
            }
        }
    }

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

    return (
    <div>
        <div>
            <Text>
                Zerox Crosschain Swap
            </Text>
        </div>
        <div>
            <Input
                placeholder="amountIn"
                variant="outlined"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                text='Amount of token you want to swap'
                type="number"
                step="0.5"
            />
        </div><div>
        <Input
                placeholder="amountIn"
                variant="outlined"
                value={amountOutMin}
                onChange={(e) => setAmountOutMin(e.target.value)}
                text='Minimum amount of token you want to get back'
                type="number"
                step="0.5"
            />
        </div><div>
        {inputListBefore.map((x, i) => {
            return (
            <div className="box" id = 'inputPathBeforeSend' align = 'center'>
                <input
                    name="address"
                    id = 'address'
                    type='text'
                    placeholder="Enter Address before Send"
                    value={x.address}
                    onChange={e => handleInputChangeBefore(e, i)}
                />
                    {inputListBefore.length !== 1 && <Button className = 'zeroxCustomChkraButton'
                    onClick={() => handleRemoveClickBefore(i)}>Sub</Button>}
                    {inputListBefore.length - 1 === i && <Button className = 'zeroxCustomChkraButton' onClick={handleAddClickBefore}>Add</Button>}
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
        </div><div>
        {inputListAfter.map((x, i) => {
            return (
            <div className="box" id = 'inputPathAfterSend' align = 'center'>
                <input
                    name="address"
                    id = 'address'
                    type='text'
                    placeholder="Enter Address After Send"
                    value={x.address}
                    onChange={e => handleInputChangeAfter(e, i)}
                />
                    {inputListAfter.length !== 1 && <Button className = 'zeroxCustomChkraButton'
                    onClick={() => handleRemoveClickAfter(i)}>Sub</Button>}
                    {inputListAfter.length - 1 === i && <Button className = 'zeroxCustomChkraButton' onClick={handleAddClickAfter}>Add</Button>}
            </div>
        );
        })}
        </div>
        <Button className = 'zeroxCustomChkraButton'
        onClick={Submit}>
            Swap
        </Button>
        <div>
        <Input
                placeholder="data payload"
                variant="outlined"
                value={dataPyload}
                onChange={(e) => setDataPayload(e.target.value)}
                text='Minimum amount of token you want to get back'
                type="string"
                step="0.5"
            />
            <Button onClick={payload(dataPyload)}>
                get payload
            </Button>
        </div>
    </div>
    );
}

export default Zerox;
