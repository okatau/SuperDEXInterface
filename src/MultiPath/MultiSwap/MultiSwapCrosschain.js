import{ useState, form } from 'react';
import {multiSwap, setDestinationNet} from "./multiSwap";
import { Button, Input, Text } from "@chakra-ui/react";


function MultiSwapCrosschain({}){
    const [inputListBefore, setInputListBefore] = useState([{ address: "0x3f951798464b47e037fAF6eBAb337CB07F5e16c9, 0x5D2Cc595eB3d8cEd105B07D6DfA8187a185E54F1, 0x38393334862fFa91e9aB802BCD3AF14afA67C688"}]);
    const [inputListAfter, setInputListAfter] = useState([{ address: "0xC75E8e8E14F370bF25ffD81148Fd16305b6aFba6, 0xE2454708A0918D899bB5b2658Bd3E8655E37316C, 0xC3d71bD825A9F00A48dF65824e974c03ab1355d0"}]);
    const [sourceToken, setSourceToken] = useState('0x8475318Ee39567128ab81D6b857e7621b9dC3442'); 
    const [destinationToken, setDestinationToken] = useState('0x7bcE539216d7E2cB1270DAA564537E0C1bA3F356'); 
    const [amountIn, setAmountIn] = useState(1);
    const [amountOutMin, setAmountOutMin] = useState(0.5);

    const [receiver, setReceiver] = useState('0x3604226674A32B125444189D21A51377ab0173d1');
    // const chainID = {"0x62": 97, "0x13881": 80001};

    // Regular multiSwap
    async function Submit(){ 
        multiSwap(amountIn, amountOutMin, sourceToken, destinationToken, receiver, inputListBefore, inputListAfter); 
    }
    
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

    return (
        <div>  
            <div>
                <Text>
                    MultiSwap crosschain swap
                </Text>
            </div>
            <Text>Base Info</Text>

            <div>
                <Input
                    placeholder="Source Token Address"
                    variant="outlined"
                    value={sourceToken}
                    onChange={(e) => setSourceToken(e.target.value)}
                    text='Amount of token you want to swap'
                    type="string"
                />
            </div>
            <div>
            <Input
                    placeholder="Destination Token Address"
                    variant="outlined"
                    value={destinationToken}
                    onChange={(e) => setDestinationToken(e.target.value)}
                    text='Amount of token you want to swap'
                    type="string"
                />
            </div>
            <div>
            <Input
                    placeholder="Amount In"
                    variant="outlined"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    text='Minimum amount of token you want to get back'
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
            </div><div>


            </div><div>

            <Input
                placeholder="Receiver"
                variant="outlined"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                text='Token receiver'
                type='string'
            />    
            </div>
            <div>
                <Text>
                    Before Send
                </Text>
            </div>
            <div>
            {inputListBefore.map((x, i) => {
                return (
                <div className="box" id = 'inputPathBeforeSend' align = 'center'>
                    <input
                        name="address"
                        id = 'address'
                        type='text'
                        placeholder="Enter (Token, Adapter, Pair) addresses before Send"
                        value={x.address}
                        onChange={e => handleInputChangeBefore(e, i)}
                    />
                        {inputListBefore.length !== 1 && <Button className = 'MultiPathCustomChkraButton'
                        onClick={() => handleRemoveClickBefore(i)}>Sub</Button>}
                        {inputListBefore.length - 1 === i && <Button className = 'MultiPathCustomChkraButton' onClick={handleAddClickBefore}>Add</Button>}
                </div>
            );
            })}
            </div>
            <div>
                <Text>
                    After Send
                </Text>
            </div>
            <div>
            {inputListAfter.map((x, i) => {
                return (
                <div className="box" id = 'inputPathAfterSend' align = 'center'>
                    <input
                        name="address"
                        id = 'address'
                        type='text'
                        placeholder="Enter (Token, Adapter, Pair) addresses after Send"
                        value={x.address}
                        onChange={e => handleInputChangeAfter(e, i)}
                    />
                        {inputListAfter.length !== 1 && <Button className = 'MultiPathCustomChkraButton'
                        onClick={() => handleRemoveClickAfter(i)}>Sub</Button>}
                        {inputListAfter.length - 1 === i && <Button className = 'MultiPathCustomChkraButton' onClick={handleAddClickAfter}>Add</Button>}
                </div>
            );
            })}
            </div>
            <div>
            <Text>Source and Destination Adapters Info generated by backend router</Text>
            </div>
            <Button className = 'MultiPathCustomChkraButton'
            onClick={Submit}>
                Swap
            </Button>
        </div> 
    )
}

export default MultiSwapCrosschain;