import{ useState, form } from 'react';
// import {multiSwap, setDestinationNet} from "./multiSwap";
import { Button, Input, Text } from "@chakra-ui/react";
import { megaSwapCrosschain } from "./megaSwap";
import '../MultiPath.css';

function MegaSwapCrosschain({}){
    const [inputListBefore, setInputListBefore] = useState([{ address: "0x3f951798464b47e037fAF6eBAb337CB07F5e16c9, 0x5D2Cc595eB3d8cEd105B07D6DfA8187a185E54F1, 0x38393334862fFa91e9aB802BCD3AF14afA67C688"}]);
    const [inputListAfter, setInputListAfter] = useState([{ address: "0xC75E8e8E14F370bF25ffD81148Fd16305b6aFba6, 0xE2454708A0918D899bB5b2658Bd3E8655E37316C, 0xC3d71bD825A9F00A48dF65824e974c03ab1355d0"}]);
    const [sourceToken, setSourceToken] = useState('0x8475318Ee39567128ab81D6b857e7621b9dC3442');
    const [destinationToken, setDestinationToken] = useState('0x7bcE539216d7E2cB1270DAA564537E0C1bA3F356');
    const [amountIn, setAmountIn] = useState(1);
    const [amountOutMin, setAmountOutMin] = useState(0.5);
    const [receiver, setReceiver] = useState('0x3604226674A32B125444189D21A51377ab0173d1');

    // New
    const [megaSwapPathPercentBefore, setMegaSwapPathPercentBefore] = useState([{ percent: 100 }]);
    const [megaSwapPathPercentAfter, setMegaSwapPathPercentAfter] = useState([{ percent: 100 }]);

    
    async function Submit(){ 
        // multiSwap(amountIn, amountOutMin, sourceToken, destinationToken, receiver, inputListBefore, inputListAfter); 
        megaSwapCrosschain(sourceToken, destinationToken, amountIn, amountOutMin, megaSwapPathPercentBefore, megaSwapPathPercentAfter, inputListBefore, inputListAfter, receiver);
        console.log(megaSwapPathPercentBefore);
        console.log(inputListBefore);
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

    // NEW
    const handlePercenChangeBefore = (e, index) => {
        const { name, value } = e.target;
        const list = [...megaSwapPathPercentBefore];
        list[index][name] = parseInt(value);
        setMegaSwapPathPercentBefore(list);
    };
    const handleRemovePercentBefore = index => {
        const list = [...megaSwapPathPercentBefore];
        list.splice(index, 1);
        setMegaSwapPathPercentBefore(list);
    };

    const handleAddPercentBefore = () => {
        setMegaSwapPathPercentBefore([...megaSwapPathPercentBefore, {percent: 0}]);
    };

    const handlePercenChangeAfter = (e, index) => {
        const { name, value } = e.target;
        const list = [...megaSwapPathPercentAfter];
        list[index][name] = parseInt(value);
        setMegaSwapPathPercentAfter(list);
    };
    const handleRemovePercentAfter = index => {
        const list = [...megaSwapPathPercentAfter];
        list.splice(index, 1);
        setMegaSwapPathPercentAfter(list);
    };

    const handleAddPercentAfter = () => {
        setMegaSwapPathPercentAfter([...megaSwapPathPercentAfter, {percent: 0}]);
    };

    return (
        <div>  
            <div>
                <Text>
                    MegaSwap crosschain
                </Text>
            </div>
            <h2>Base Info</h2>

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
            <div className='parentBox'>
                <div className='inlineBox'>
                    <h2>
                        Before Send
                    </h2>
                    <p>Percent per path(def 100%)</p>
                    {megaSwapPathPercentBefore.map((x, i) => {
                        return (
                            <div id = 'inputPathPercentBefore' align='center'>
                                <input 
                                    name="percent"
                                    id = 'percent'
                                    type="number"
                                    placeholder='Enter percent per path'
                                    value={x.percent}
                                    onChange={(e) => handlePercenChangeBefore(e, i)}
                                />
                                {megaSwapPathPercentBefore.length !== 1 && 
                                <Button 
                                    className = 'MultiPathCustomChkraButton' 
                                    onClick={() => handleRemovePercentBefore(i)}
                                >Sub</Button>}
                                {megaSwapPathPercentBefore.length - 1 === i && <Button className = 'MultiPathCustomChkraButton' onClick={handleAddPercentBefore}>Add</Button>}
                            </div>
                        )
                    })}
                <Text>Path before</Text>
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
                <div className='inlineBox'>
                    <h2>
                        After Send
                    </h2>
                    <Text>Percent per path(def 100%)</Text>
                    {megaSwapPathPercentAfter.map((x, i) => {
                        return (
                            <div className="box" id = 'inputPathPercentBefore' align = 'center'>
                                <input 
                                    name="percent"
                                    id = 'percent'
                                    type="number"
                                    placeholder='Enter percent per path'
                                    value={x.percent}
                                    onChange={(e) => handlePercenChangeAfter(e, i)}
                                />
                                {megaSwapPathPercentAfter.length !== 1 && 
                                <Button 
                                    className = 'MultiPathCustomChkraButton' 
                                    onClick={() => handleRemovePercentAfter(i)}>Sub</Button>}
                                {megaSwapPathPercentAfter.length - 1 === i && <Button className = 'MultiPathCustomChkraButton' onClick={handleAddPercentAfter}>Add</Button>}
                            </div>
                        )
                    })}
                <Text>Path after</Text>
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
            </div>
            <div>
                <Button className = 'MultiPathCustomChkraButton'
                onClick={Submit}>
                    Swap
                </Button>
            </div>
        </div> 
    )
}

export default MegaSwapCrosschain;