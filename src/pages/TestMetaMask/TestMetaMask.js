import{ useState, form } from 'react';
import '../Mint/App.css';
import './TestMetaMask.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useLocation, useNavigate } from 'react-router-dom';

import detectEthereumProvider from '@metamask/detect-provider'

const connectNetwork = async () => {
    await (window).ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainName: 'mumbai test',
          chainId: `0x${Number(80001).toString(16)}`,
          nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com']
        }
      ]
    });
  }

function getMobileOS(){
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
        return "Android"
    }
    else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        return "iOS"
    }
    return "Other"
}

function TestMetaMask() {
    const navigate = useNavigate();
    const location = useLocation();
    const [accounts, setAccounts] = useState([]);
    const isConnected = Boolean(accounts[0]);
    const [device, setDevice] = useState('something');

    async function Connect(){
        console.log(getMobileOS());
    const provider = await detectEthereumProvider()
        if (provider) {
        console.log('Ethereum successfully detected!')
        const chainId = await provider.request({
            method: 'eth_chainId'
        })
        console.log(chainId);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        setAccounts(accounts);
        } else {
            console.error('Please install MetaMask!')
        }
    connectNetwork();
    }
    
    return (
        <div className="overlay">
            <div>
                <div>
                    <Button className = 'chkraButton' onClick={() => setDevice(getMobileOS())} >
                       Detect OS
                    </Button>
                </div>
            <div>
            {device == 'iOS' || device == 'Android' ? (
                <div>
                    <Button className = 'chkraButton' onClick={()=>window.open('https://metamask.app.link/dapp/glebzverev.github.io/web-tsm/#/testmm')} >
                        Jump on MetaMask
                    </Button>
                    <Text className='baseText' fontFamily="VT323">
                        {device}
                    </Text>
                </div>       
            ):(
                <div>
                    {isConnected ? (
                    <div>
                        <div>
                            <Text className='baseText' fontFamily="VT323">
                                {accounts[0]}
                            </Text>
                        </div>
                    </div>
                    ):(
                    <div>
                        <Button className = 'chkraButton' onClick={Connect} >
                            Connect {device}
                        </Button>
                    </div>)
                    }
                </div>
            )
            }
            </div>

            </div>
            <div className="moving-background"> </div>
        </div>
    );
  }
  
  
export default TestMetaMask;