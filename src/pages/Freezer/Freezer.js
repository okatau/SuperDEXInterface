import{ useState, form } from 'react';
import '../Mint/App.css';
import './Freezer.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import IFreezer from "../../abi/Freezer.json";
import TSM from "../../abi/ITSM.json";

const FreezerAddress = "0x4049A3FD1964B6afddA1701d3259073cA2FB3434";
const TSMAddress = "0x259Ed7cc1D004bEe497c1eF818e6Aa19cC060808";


function Freezer() {
    const [accounts, setAccounts] = useState([]);
    const isConnected = Boolean(accounts[0]);
    const [Admin, setAdmin] = useState(false);
    const [withdrawAmount, setwithdrawAmount] = useState('0');
    const [Verifiyed, setVerifiyed] = useState('False');
    

    async function Withdraw(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            FreezerAddress,
            IFreezer.abi,
            signer
            );
            try {
                let response = await contract.withdraw();
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            } 
        }       
    }

    async function getWithdrawAmount(contract){
        console.log("getWithdrawAmount");
        try {
            let response = await contract.claimList(accounts[0]);
            console.log("withDraw: ", response/10**18);
            setwithdrawAmount(response/10**18);
        } catch (err) {
            console.log("error: ", err);
        } 
    }

    async function checkUser(){
        if (window.ethereum) {
            const regUser = accounts[0];
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                TSMAddress,
                TSM.abi,
                signer
        );
        try {
            var valid = true;
            try {
              ethers.utils.getAddress(regUser)
            } catch(err){
              valid = false
            }
            if (valid){
                setVerifiyed('download data ...');
            console.log(regUser.toString());
            let response = await contract.checkUser(regUser);
            console.log((response));
            if (response == true)
                setVerifiyed('True');
            else
                setVerifiyed('False');
            }
            else
                setVerifiyed("Address is not correct");
        } catch (err) {
            console.log("error: ", err);
            }
        }
    }

    

    async function Connect(){
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });  
            setAccounts(accounts);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            FreezerAddress,
            IFreezer.abi,
            signer
            );
        getWithdrawAmount(contract);
        checkUser();
        }
    }
    
    return (
        <div className="overlay">
            <div>
            </div>

            <div>
                {isConnected ? (
                <div>
                    <div>
                    <Text className='baseText' fontFamily="VT323">
                        You're Balance: {withdrawAmount}
                    </Text>
                    </div>
                    <div>
                    <Text className='baseText' fontFamily="VT323">
                        You're Verifiyed: {Verifiyed}
                    </Text>
                    <Button className = 'chkraButton' onClick={Withdraw}>
                        Withdraw 
                    </Button>
                    </div>
                    <div>
                    <Text className='baseText' fontFamily="VT323">
                        {accounts[0]}
                    </Text>
                    </div>
                    <div >

                    <Button className = 'chkraButton' onClick={Connect} >
                        Update data
                    </Button>
                </div>
                </div>
                ):(
                <div>
                    <Button className = 'chkraButton' onClick={Connect} >
                        Connect
                    </Button>
                </div>)
                }  
            </div>
            
            <div className="moving-background"> </div>
        </div>
    );
  }
  
  
export default Freezer ;