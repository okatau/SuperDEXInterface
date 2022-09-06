import{ useState, form } from 'react';
// import styled from "styled-components";
import Uniswap from './../Uniswap/Uniswap'
import Zerox from './../Zerox/Zerox'

import './CrosschainRouter.css';
import './Background.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";

function CrosschainRouter(){
    const [routerValue, setRouterValue] = useState('UniswapV2Router');
    const [module, setModule] = useState(Uniswap());
    const [customBackground, setBackground] = useState('uniswap-background');
    
    function returnRouter(){
        if (routerValue == 'UniswapV2Router'){   
            setModule(Uniswap());
            setBackground('uniswap-background')
        }
        else if (routerValue == 'ZeroxV4'){
            setModule(Zerox())
            setBackground('zerox-background')
        }
        else{
            setBackground('base-background')
            setModule(<div>Module is not ready</div>)
        }
    }  

    function changeSelect() {
        setRouterValue(document.getElementById('Router').value);
    }
    

    return (
    <div className="overlay">
    <div>
        <select id='Router' value={routerValue} onChange={changeSelect}>
            <option>UniswapV2Router</option>
            <option>ZeroxV4</option>
            <option>MultiPath</option>
            <option>SimpleSwap</option>
            <option>NewUniswapV2ExchangerRouter</option>
        </select>
        <Button onClick={returnRouter}>
            Set Router
        </Button>
    </div>
    <div>
        {module}
    </div>
        <div className={customBackground}> </div>
    </div>
    );
}

export default CrosschainRouter;
