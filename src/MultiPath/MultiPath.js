import{ useState, form } from 'react';

import './MultiPath.css';
import MultiSwapCrosschain from './MultiSwap/MultiSwapCrosschain';
import MultiSwapOneChain from './MultiSwap/MuliSwapOneChain';
import MegaSwapCrosschain from './MegaSwap/MegaSwapCrosschain';

import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";

function MultiPath({}){
    const [isMultiSwap, setMultiSWap] = useState(true);
    const [isCrossChainSwap, setIsCrosschainSwap] = useState(true);

    const setTypeSwap = () => {
        let value = document.getElementById("swapType").value;
        console.log(isCrossChainSwap);
        if(value == "Crosschain swap"){
            setIsCrosschainSwap(true);
            return;
        }
        setIsCrosschainSwap(false);
        return;
    }

    const setFunction = () => {
        let value = document.getElementById("chooseFunction").value;
        console.log(isMultiSwap);
        if (value == "MultiSwap"){
            setMultiSWap(true);
            return;
        }
        setMultiSWap(false);
        return;
    }

    return (
    <div>
        <div>
            <select id='chooseFunction' onChange={setFunction}>
                <option>MultiSwap</option>
                <option>MegaSwap</option>
            </select>
        </div>
        <div>
            <select id='swapType' onChange={setTypeSwap}>
                <option>Crosschain swap</option>
                <option>Regular swap</option>
            </select>
        </div>

        {isMultiSwap && isCrossChainSwap &&
        <MultiSwapCrosschain/>
        }
        {isMultiSwap && !isCrossChainSwap &&
        <MultiSwapOneChain/>
        }
        {!isMultiSwap && isCrossChainSwap &&
        <MegaSwapCrosschain/>
        }
        {!isMultiSwap && !isCrossChainSwap && 
        <Text>MegaSwap one chainID</Text>
        }
    </div>
    );
}

export default MultiPath;