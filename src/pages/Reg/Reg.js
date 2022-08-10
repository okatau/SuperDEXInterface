import{ useState } from 'react';
import '../Mint/App.css';
import './Reg.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import TSM from "../../abi/ITSM.json";
import { ethers } from "ethers";
import NavBar from '../Mint/NavBar';
import { setConstantValue } from 'typescript';



const TSMAddress = "0x02AA86D77B29e9358602Dd45a0CafDEF477a76c2";


function Reg() {
    const [verified, setVerifid] = useState('0x3604226674A32B125444189D21A51377ab0173d1 is Verified');
  

    async function checkUser(){
        if (window.ethereum) {
            const regUser = document.getElementById('regUser').value;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                TSMAddress,
                TSM.abi,
                signer
        );
        try {
            let response = await contract.checkUser(regUser);
            console.log((response.toString()));
            if (response == true)
                setVerifid(regUser + '\t is Verified');
            else
                setVerifid(regUser + '\t is NOT Verified');
        } catch (err) {
            console.log("error: ", err);
            }
        }
    }

    return (
        <div className="overlay">
            <div className="App">
            <Input
                name="amount"
                fontFamily="inherit"
                id="regUser"
                width="700px"
                height="40px"
                textAlign="center"
                paddingLeft="30px"
                marginTop="10px"
                type="string"
              />

            <Button
                // className='c-button'
                backgroundColor="#008fd4"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="10"
                onClick = {checkUser}
                > Check Address
            </Button>
            <p>
                {verified}
            </p>

            
            {/* <Input
                name="amount"
                fontFamily="inherit"
                id="regUser"
                width="700px"
                height="40px"
                textAlign="center"
                paddingLeft="30px"
                marginTop="10px"
                type="string"
              />

            <Button
                // className='c-button'
                backgroundColor="#008fd4"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="10"
                onClick = {checkUser}
                > Check Address
            </Button>
            <p>
                {verified}
            </p> */}

                <div className="moving-background"> </div>
  
            </div>
        </div>
    );
  }
  
  
export default Reg;