import{ useState, form } from 'react';
// import styled from "styled-components";

import './NewUniswap.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import { ethers, BigNumber } from "ethers";
import { SwapUniswap } from './swapNewUniswap';


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
    const [receiver, setReceiver] = useState(ethers.constants.AddressZero);

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

    async function Submit(){ 
        SwapUniswap(amountIn, amountOutMin, pairListBefore, pairListAfter, tokenInBefore, tokenInAfter, receiver); 
    }

    return (
    <div>
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
            </div>
            <div>
                <Input
                    placeholder="Amount Out Min"
                    variant="outlined"
                    value={amountOutMin}
                    onChange={(e) => setAmountOutMin(e.target.value)}
                    text='Minimum amount of token you want to get back'
                    type="number"
                    step="0.5"
                />
            </div>
            <div>
                <Input
                    placeholder="Token in before bridge"
                    variant="outlined"
                    value={tokenInBefore}
                    onChange={(e) => setTokenInBefore(e.target.value)}
                    text='First token in path before bridge'
                    type="text"
                /> 
            </div>
            <div>
                <Input
                    placeholder="Token in after bridge"
                    variant="outlined"
                    value={tokenInAfter}
                    onChange={(e) => setTokenInAfter(e.target.value)}
                    text='First token in path after bridge'
                    type="text"
                /> 
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
        </div>
    </div>
    );
}

export default NewUniswap;
