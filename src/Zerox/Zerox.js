import{ useState, form } from 'react';
import './Zerox.css';
import {SwapZerox} from './swapZerox';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";

function Zerox({}){
    const [sourceTokenBefore, setSourceTokenBefore] = useState('0x8475318Ee39567128ab81D6b857e7621b9dC3442');
    const [destinationTokenBefore, setDestinationTokenBefore] = useState('0x3f951798464b47e037fAF6eBAb337CB07F5e16c9');
    const [sourceTokenAfter, setSourceTokenAfter] = useState('0xC75E8e8E14F370bF25ffD81148Fd16305b6aFba6');
    const [destinationTokenAfter, setDestinationTokenAfter] = useState('0x7bcE539216d7E2cB1270DAA564537E0C1bA3F356');
    const [amountIn, setAmountIn] = useState(1);
    const [amountOutMin, setAmountOutMin] = useState(0.5);
    const [receiver, setReceiver] = useState("0x3604226674A32B125444189D21A51377ab0173d1");

    async function Submit(){ 
        SwapZerox(amountIn, amountOutMin, sourceTokenBefore, destinationTokenBefore, sourceTokenAfter, destinationTokenAfter, receiver); 
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
        </div>
        <div>
            <Input
                placeholder="amountIn"
                variant="outlined"
                value={amountOutMin}
                onChange={(e) => setAmountOutMin(e.target.value)}
                text='Minimum amount of token you want to get back'
                type="number"
                step="0.5"
            />
        </div>
        <div className='inlineBox'>
            <Text>Token before</Text>
            <div>
                <Input 
                    placeholder='1st token before'
                    value={sourceTokenBefore}
                    onChange={(e) => setSourceTokenBefore(e.target.value)}
                    text='1st token before'
                    type='text'
                />
            </div>
            <div>
                <Input
                    placeholder='2nd token before'
                    value={destinationTokenBefore}
                    onChange={(e) => setDestinationTokenBefore(e.target.value)}
                    text='2nd token before'
                    type='text'
                />
            </div>
        </div>
        <div className='inlineBox'>
            <Text>Token after</Text>
            <div>
            <Input
                placeholder='1st tokenafter'
                value={sourceTokenAfter}
                onChange={(e) => setSourceTokenAfter(e.target.value)}
                text='1st token after'
                type='text'
            />
            </div>
            <div>
            <Input
                placeholder='2nd token after'
                value={destinationTokenAfter}
                onChange={(e) => setDestinationTokenAfter(e.target.value)}
                text='2nd token after'
                type='text'
            />
            </div>
        </div>
        <div>
            <Text>Receiver</Text>
            <Input
                placeholder='Receiver'
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                text='Receiver'
                type='text'
            />
        </div>
        <div>
            <Button className = 'zeroxCustomChkraButton'
            onClick={Submit}>
                Swap
            </Button>
        </div>
        </div>
    );
}

export default Zerox;
