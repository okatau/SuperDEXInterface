import{ useState, form } from 'react';
import Uniswap from './../Uniswap/Uniswap'
import Zerox from './../Zerox/Zerox'
import './CrosschainRouter.css';
import './Background.css';
import Connect from './Connect';
import Approve from './Approve';
import { render } from 'react-dom';
import NavBar from './NavBar';

import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";

function CrosschainRouter(){

    const [isCrosschain, setIsCrosschain] = useState(true);
    const [routerValue, setRouterValue] = useState('UniswapV2Router');
    const [customBackground, setBackground] = useState('base-background');
    const [signer, setSigner] = useState('');
    const [isConnected, setIsConnected] = useState(Boolean(signer)); 
    const [isUniswap, setIsUniswap] = useState(false); 
    const [isZerox, setIsZerox] = useState(false); 
    const [renderconnectinfo, setrenderconnectinfo] = useState('');

    return (
        <div>
    <div className="overlay">
        <Connect 
        signer={signer} setSigner={setSigner} 
        isConnected={isConnected} setIsConnected={setIsConnected}
        renderconnectinfo={renderconnectinfo} setrenderconnectinfo={setrenderconnectinfo}
        />
        <NavBar 
        routerValue={routerValue}
        setRouterValue={setRouterValue} 
        setBackground={setBackground}
        setIsUniswap={setIsUniswap}
        setIsZerox={setIsZerox}
        setIsCrosschain={setIsCrosschain}
        />
        {
        isUniswap && 
            <Uniswap  />
        }
        
        {
        isZerox &&
            <Zerox />
        }
        <Approve />
        <div className={customBackground}> </div>
    </div>
    </div>
    );
}

export default CrosschainRouter;
