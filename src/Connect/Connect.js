import{ useState, form } from 'react';
import React from 'react';
import './../Router/CrosschainRouter.css';
import './Connect.css';
import './../Router/Background.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";

function Connect({signer, setSigner, isConnected, setIsConnected ,renderconnectinfo, setrenderconnectinfo}){
    const targetNetworkId = ['0x61', '0x13881'];
    const [net, setNet] = useState('Switch Net');

    async function ConnectF(){
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setSigner(accounts[0]);
            setIsConnected(Boolean(accounts[0]));
            console.log(accounts);
            if (isConnected) {
                let net = await checkNetwork();
                if (!net[0]){
                    console.log("switch net")
                    switchNetwork();
                }
                writeConnectInfo(net[1]);
            };
        }
        console.log(signer.length);

    }

    const checkNetwork = async () => {
        if (window.ethereum) {
          const currentChainId = await window.ethereum.request({
            method: 'eth_chainId',
          });
          console.log(currentChainId);
          return [Boolean(currentChainId == targetNetworkId[0] | currentChainId == targetNetworkId[1]), currentChainId];
        }
    }

    const switchNetwork = async () => {
        let currentNet = await checkNetwork();
        console.log("currenet net", currentNet);
        if (currentNet[1] == targetNetworkId[0]){
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetworkId[1] }],
              });      
        }
        else{
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetworkId[0] }],
            });
        }
        writeConnectInfo(currentNet[1]);
        ConnectF();
        };

    function writeConnectInfo(checkNetwork){
        var print = '';
        for (var i=0; i < 5; i++){
            print+=signer[i];
        }
        print+='.....';
        for (var i = 3; i > 0; i--){
            print += signer[signer.length-i];
        }
        if (checkNetwork=='0x61')
        {
            setNet('BSC testnet');
        }
        if (checkNetwork=='0x13881'){
            setNet('Polygon Mumbai testnet');
        }
    }
    return(
        <div>
        {isConnected ? (
            <div className='right'>
            <p>
            <Button className="customButton" onClick={ConnectF}> {signer[0]+signer[1]+signer[2]+signer[3]+'...'+signer[40]+signer[41]}
            </Button>  
            </p>

            <p>
            <Button className="customButton" onClick={ConnectF}> {net}
            </Button>  
            </p>

            <Button className="customButton" onClick={switchNetwork}> Switch network
            </Button>   
            </div>
            ):(
            <div className='right'>
            <Button className="customButton" onClick={ConnectF}> connect
            </Button>   
            </div>
        )}
        </div>
    );
}


export default Connect;