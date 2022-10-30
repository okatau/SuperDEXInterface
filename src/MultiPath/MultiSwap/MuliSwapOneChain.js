import{ useState, form } from 'react';
import { Button, Input, Text } from "@chakra-ui/react";

function MultiSwapOneChain({}){
    const [tokenIn, setTokenInMS] = useState('0x8475318Ee39567128ab81D6b857e7621b9dC3442');
    const [amountInMS, setAmountInMS] = useState(1);
    const [amountOutMinMS, setAmountOutMinMS] = useState(0);
    const [receiverMS, setReceiverMS] = useState('0x3604226674A32B125444189D21A51377ab0173d1');
    const [pathMS, setPathMS] = useState([{ address: "0x3f951798464b47e037fAF6eBAb337CB07F5e16c9, 0x5D2Cc595eB3d8cEd105B07D6DfA8187a185E54F1, 0x38393334862fFa91e9aB802BCD3AF14afA67C688"}]);
    async function SubmitMultiSwapReg(){
        console.log("asdewqzxc");
    }

    const handlePathMS = (e, index) => {
        const { name, value } = e.target;
        const list = [...pathMS];
        list[index][name] = value;
        setPathMS(list);
    };

    const handleRemovePathMS = index => {
        const list = [...pathMS];
        list.splice(index, 1);
        setPathMS(list);
    };

    const handleAddPathMS = () => {
        setPathMS([...pathMS, { address: ""}]);
    };

    return (
        <div>
            <div>
                <Text>
                    MultiSwap regular swap
                </Text>
            </div>
            <div>
                <Input
                    placeholder="Source Token Address"
                    variant="outlined"
                    value={tokenIn}
                    onChange={(e) => setTokenInMS(e.target.value)}
                    text='Amount of token you want to swap'
                    type="string"
                />
            </div>
            <div>
            <Input
                    placeholder="Amount In"
                    variant="outlined"
                    value={amountInMS}
                    onChange={(e) => setAmountInMS(e.target.value)}
                    text='Minimum amount of token you want to get back'
                    type="number"
                    step="0.5"
                />
            </div>
            <div>
            <Input
                    placeholder="Amount Out Min"
                    variant="outlined"
                    value={amountOutMinMS}
                    onChange={(e) => setAmountOutMinMS(e.target.value)}
                    text='Minimum amount of token you want to get back'
                    type="number"
                    step="0.5"
                />
            </div><div>


            </div><div>

            <Input
                placeholder="Receiver"
                variant="outlined"
                value={receiverMS}
                onChange={(e) => setReceiverMS(e.target.value)}
                text='Token receiver'
                type='string'
            />    
            </div>
            <div>
                <Text>
                    Token out
                </Text>
            </div>
            <div>
            {pathMS.map((x, i) => {
                return (
                <div className="box" id = 'inputPathBeforeSend' align = 'center'>
                    <input
                        name="address"
                        id = 'address'
                        type='text'
                        placeholder="Enter (Token, Adapter, Pair) addresses before Send"
                        value={x.address}
                        onChange={e => handlePathMS(e, i)}
                    />
                        {pathMS.length !== 1 && <Button className = 'MultiPathCustomChkraButton'
                        onClick={() => handleRemovePathMS(i)}>Sub</Button>}
                        {pathMS.length - 1 === i && <Button className = 'MultiPathCustomChkraButton' onClick={handleAddPathMS}>Add</Button>}
                </div>
                );  
            })}
            </div>
            <Button className = 'MultiPathCustomChkraButton'
            onClick={SubmitMultiSwapReg}>
                Swap
            </Button>
        </div>
    )
}
export default MultiSwapOneChain;