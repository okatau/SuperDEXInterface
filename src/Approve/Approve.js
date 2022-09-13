import{ useState, form } from 'react';
// import './CrosschainRouter.css';
// import './Background.css';
import './Approve.css';
import { ethers, BigNumber } from "ethers";


import IERC20ABI from "./../abi/IERC20ABI.json"
import './../Connect/Connect.css';
import { Box, Stack, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";


function Approve({}){
    const [amountIn, setAmountIn] = useState('');
    const [address, setAddress] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    
    async function approve(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
              tokenAddress,
              IERC20ABI,
              signer
            );
            try {
                console.log("try Swap");
                const amount = ethers.utils.parseEther((amountIn).toString()); 
                let response = await contract.approve(address, amount);
            } catch (err) {
              console.log("error: ",err);
            }
        }
    }
    return(
    <div>
        {/* <Stack spacing={4} align='stretch'> */}
            <div>
                <Text>
                    Approve
                </Text>
            </div>
            <div>
            <Input
                placeholder="token address"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                text='Amount of token you want to swap'
                type="string"
                size="small"
                width="auto"
            /></div>
            <div>
            <Input
                placeholder="amount to approve"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                text='Amount of token you want to swap'
                type="number"
                step="0.5"
                size="xs"
                width="auto"
            /></div>
            <div>
            <Input
                placeholder="address to"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                text='Minimum amount of token you want to get back'
                type="string"
            /></div>
            <Button className="customButton" onClick={approve}>
                Approve
            </Button>
        {/* </Stack> */}
    </div>
    )
}
export default Approve;