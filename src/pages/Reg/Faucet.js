import{ useState, form } from 'react';
import '../Mint/App.css';
import './Faucet.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import NavBar from '../Mint/NavBar';
import { setConstantValue } from 'typescript';
import { click } from '@testing-library/user-event/dist/click';
import IFaucet from "../../abi/IFaucet.json";



const FaucetAddress = "0x843036bd0e7DD7Bf1A054e3619eD119A013005Db";


function Faucet() {
    const [accounts, setAccounts] = useState([]);
    const isConnected = Boolean(accounts[0]);
    const [inputList, setInputList] = useState([{ address: "", percent: "" }]);


    function click(){
        console.log("click");
        // console.log("value");
    }
// handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };
    
    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };
    
    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { address: "", percent: "" }]);
    };

    async function changeBrooks(){
        console.log('ChangeBrooks');
        var brooksAddress = document.querySelectorAll('[id="address"]');
        var brooksPercent = document.querySelectorAll('[id="percent"]');
        var brooks = new Array();
        for (var i = 0; i< brooksAddress.length; i++){
            console.log(brooksAddress[i].value, brooksPercent[i].value);
            var brook = new Array(brooksAddress[i].value, brooksPercent[i].value*10000) 
            brooks.push(brook);
        }
        console.log(brooks);
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            FaucetAddress,
            IFaucet.abi,
            signer
            );
            try {
                let response = await contract.updateBrooks(brooks);
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            }
        }
    }

    async function Disturbe(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            FaucetAddress,
            IFaucet.abi,
            signer
            );
            try {
                let response = await contract.DisturbeFunds();
                console.log(response);
            } catch (err) {
                console.log("error: ", err);
            } 
        }       
    }

    async function Withdraw(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
            FaucetAddress,
            IFaucet.abi,
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


    async function Connect(){
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        setAccounts(accounts);
        console.log(isConnected);
        }
    }

    return (
        <div className="overlay">
            {inputList.map((x, i) => {
            return (
                <div className="box" id = 'inputBrooks'>
                    <input
                        name="address"
                        id = 'address'
                        type='text'
                        placeholder="Enter Address"
                        value={x.address}
                        onChange={e => handleInputChange(e, i)}
                    />
                    <input
                        className="ml10"
                        id = 'percent'
                        name="percent"
                        type="number"
                        step="0.01"
                        placeholder="Enter percent"
                        value={x.percent}
                        onChange={e => handleInputChange(e, i)}
                    />
                    <div className="btn-box">
                        {inputList.length !== 1 && <button
                        className="mr10"
                        onClick={() => handleRemoveClick(i)}>Remove</button>}
                        {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
                    </div>
                </div>
            );
            })}
            <div>
                {isConnected ? (
                <div>
                    <div className="btn-box">
                        <button className="mr10" onClick={changeBrooks}>
                            Change Brooks {}
                        </button>
                    </div>
                    <div className="btn-box">
                        <button className="mr10" onClick={Disturbe}>
                            Disturbe Funds {}
                        </button>
                    </div>
                    <div className="btn-box">
                        <button className="mr10" onClick={Withdraw}>
                            Withdraw {}
                        </button>
                    </div>
                    <div>
                        {accounts[0]}
                    </div>
                    <div className="btn-box">
                    <button className="mr10" onClick={Connect}>
                        Update data
                    </button>
                </div>
                </div>
                ):(
                <div className="btn-box">
                    <button className="mr10" onClick={Connect}>
                        Connect
                    </button>
                </div>)
                }  
            </div>
            
            <div className="moving-background"> </div>
        </div>
    );
  }
  
  
export default Faucet;