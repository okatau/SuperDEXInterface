import{ useState, form } from 'react';
import '../Mint/App.css';
import './Valve.css';
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import ValveABI from "../../abi/Valve.json";

const listValve = {
    "0xed75af74cf9ca5a98a37ddba36f37cf28949a089": "0xdB01244c5AB5E90eE0d0F2D09183C53E21eeb710",
    "0x3fd67e4c6aeb513128475ff1788a6d90c666fc5c": "0xd9ab2DAb6F1dE86fa2Fb48F3B2f94e02Cd982Ba8",
    "0x01bd218794a8ea20d2b53a43cb16fdcc19fbdac3": "0x030117c46818072F0C0EDa9D5Ed1567461699780",
    "0x3604226674a32b125444189d21a51377ab0173d1": "0x4FC47a5B4280c90D714Dca7b3323749Ba6E09947"
    };

const listName = {
    "0xed75af74cf9ca5a98a37ddba36f37cf28949a089": "Welcome, Daniil",
    "0x3fd67e4c6aeb513128475ff1788a6d90c666fc5c": "Welcome, Dmitriy",
    "0x01bd218794a8ea20d2b53a43cb16fdcc19fbdac3": "Welcome, Amir",
    "0x3604226674a32b125444189d21a51377ab0173d1": "Welcome, Gleb"
}
// const ValveAddress = "0x843036bd0e7DD7Bf1A054e3619eD119A013005Db";


function Valve() {
    const [accounts, setAccounts] = useState([]);
    const isConnected = Boolean(accounts[0]);
    const [Admin, setAdmin] = useState(false);
    const [withdrawAmount, setwithdrawAmount] = useState('');
    const [TotalBalance, setTotalBalance] = useState('');
    const [DistributedBalance, setDistributedBalance] = useState('');
    const [inputList, setInputList] = useState([{ address: "", percent: "" }]);
    const [Hello, setHello] = useState("Hello");
    const [renderBrooks, setRenderBrooks] = useState([{"address": ["percent", "balance"]}])
    const [strBrooks, setStrBrooks] = useState("Download Data ...");
    

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

    function makeStrBrooks(){
        var s = '';
        for (var key in renderBrooks){
            s += key+ ": "+renderBrooks[key]+"%     ";
        }
        setStrBrooks(s);
    }

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
            console.log(accounts[0]);
            var ValveAddress = listValve[accounts[0]];
            const contract = new ethers.Contract(
            ValveAddress,
            ValveABI.abi,
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

    async function Brooks(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                listValve[accounts[0]],
                ValveABI.abi,
                signer
                );    
        console.log("BROOKS!");
        try {
            var brooks = {}
            var i = 0;
            let brook;
            let percent;
            let balance;
            while (true){
                brook = await contract.Brooks(i); 
                percent = await contract.percent(brook);
                balance = await contract.balance(brook);
                brooks[brook] = percent/10**4;
                i+=1;
            }
        } catch (err) {
            console.log("error: ", err);
        } 
        setRenderBrooks(brooks);
        makeStrBrooks();
        }
    }

    async function Distribute(){
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            var ValveAddress = listValve[accounts[0]];
            const contract = new ethers.Contract(
            ValveAddress,
            ValveABI.abi,
            signer
            );
            try {
                let response = await contract.DistributeFunds();
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
            var ValveAddress = listValve[accounts[0]];
            const contract = new ethers.Contract(
            ValveAddress,
            ValveABI.abi,
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

    async function isAdmin(contract){
        console.log("isAdmin");
        try {
            let response = await contract.hasRole("0x0000000000000000000000000000000000000000000000000000000000000000", accounts[0]);
            console.log("isAdmin: ", response);
            setAdmin(response);
            if (accounts[0] in listName){
                setHello(listName[accounts[0]]);
            }
        } catch (err) {
            console.log("error: ", err);
        } 
    }

    async function getWithdrawAmount(contract){
        console.log("getWithdrawAmount");
        try {
            let response = await contract.info(accounts[0]);
            console.log("withDraw: ", response[0]/10**18);
            setwithdrawAmount(response[0]/10**18);
        } catch (err) {
            console.log("error: ", err);
        } 
    }

    async function getTotalBalance(contract){
        console.log("getTotalBalance");
        try {
            let response = await contract.TotalBalance();
            console.log("totalBalance: ", response/10**18);
            setTotalBalance(response/10**18);
        } catch (err) {
            console.log("error: ", err);
        }
    }

async function getDistributed(contract){
        console.log("getDistributed");
        try {
            let response = await contract.TotalDistributed();
            console.log("totalDistributed: ", response/10**18);
            setDistributedBalance(response/10**18);
        } catch (err) {
            console.log("error: ", err);
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
            const ValveAddress = listValve[accounts[0]];
            const contract = new ethers.Contract(
            ValveAddress,
            ValveABI.abi,
            signer
            );
        isAdmin(contract);
        getWithdrawAmount(contract);
        getTotalBalance(contract);
        getDistributed(contract);
        Brooks();
        }
    }
    
    return (
        // Left screen
        <div className="overlay">
            <div>
              {
                Admin ? (
                    <div className='split left'>
                        <Text className='baseText' fontFamily="VT323">
                            {Hello}
                        </Text>
                        {inputList.map((x, i) => {
                return (
                <div className="box" id = 'inputBrooks' align = 'center'>
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
                    <div >
                        {inputList.length !== 1 && <Button className = 'addRemovebutton'
                        onClick={() => handleRemoveClick(i)}>Remove</Button>}
                        {inputList.length - 1 === i && <Button className = 'addRemovebutton' onClick={handleAddClick}>Add</Button>}
                    </div>
                </div>
            );
            })} 
                            <div align = 'center'>
                        <Button className = 'chkraButton' onClick={changeBrooks}>
                            Change Brooks 
                        </Button>
                        <Text className='baseText' fontFamily="VT323" padding = '0px'>
                       ------------------------------------
                        </Text>
                    </div> 
                    
                    <Button className = 'chkraButton' onClick={Distribute}>
                            Distribute Funds 
                    </Button>
                    </div>
                ):(
                    <div className='split left'>
                        <Text className='baseText' fontFamily="VT323">
                            You are not Admin!
                        </Text>
                    </div>
                )
              }  
            </div>

            <div>
                {isConnected ? (
                <div>
                    <div className='split right'>
                        <div>
                        <Text className='baseText' fontFamily="VT323">
                            {strBrooks}
                        </Text>
                        <Text className='baseText' fontFamily="VT323">
                            --------------------------
                        </Text>
                        <Text className='baseText' fontFamily="VT323">
                            Distributed Balance: {DistributedBalance}
                        </Text>
                        <Text className='baseText' fontFamily="VT323">
                            Total Balance: {TotalBalance}
                        </Text>
                        </div>
                            <div>

                            <Text className='baseText' fontFamily="VT323">
                                Withdraw Avaiable {withdrawAmount}
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
                </div>
                ):(
                <div className='split right'>
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
  
  
export default Valve;