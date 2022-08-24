import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import TSM from "../../abi/ITSM.json";

const TSMAddress = "0x259Ed7cc1D004bEe497c1eF818e6Aa19cC060808";

const MaintMint = ({ accounts, setAccounts }) => {
  const [value, setValue] = useState(0);
  const isConnected = Boolean(accounts[0]);
  const [verified, setVerifid] = useState('Enter Address to check ');
  const [addedUser, setAddedUser] = useState('Enter refferal to add ')
  

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
          var valid = true;
          try {
            ethers.utils.getAddress(regUser)
          } catch(err){
            valid = false
          }
          if (valid){
          setVerifid('download data ...');
          console.log(regUser.toString());
          let response = await contract.checkUser(regUser);
          console.log((response));
          if (response == true)
              setVerifid(regUser + '\t is Verified');
          else
              setVerifid(regUser + '\t is NOT Verified');
          }
          else
            setVerifid("Address is not correct");
      } catch (err) {
          console.log("error: ", err);
          }
      }
  }

  async function addUser(){
    if (window.ethereum) {
        const regUser = document.getElementById('addUser').value;
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
        setAddedUser('download data ...');
        console.log(regUser.toString());
        let response = await contract.checkUser(regUser);
        console.log((response));
        if (response == true)
            setAddedUser(regUser + '\t is Added (Verifiyed)');
        else
            setAddedUser(regUser + '\t is Added (NOT Verifiyed)');
        }
        else
          setAddedUser("Address is not correct");
    } catch (err) {
        console.log("error: ", err);
        }
    }
}
  
  const handleChange = (amount) => {
    if (amount <= 0 )
      alert("Amount should be greater then 0");  
  };

  async function Count(){
    if (window.ethereum) {
      const amount = document.getElementById('totalAmt').value;
      handleChange(amount);
    const decimals = 18;
    const num = ethers.utils.parseEther(BigNumber.from(amount*2000).mul(BigNumber.from(10).pow(decimals)).toString());
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      TSMAddress,
      TSM.abi,
      signer
    );
    try {
        let response = await contract.amountToSend(ethers.utils.parseEther((amount*1000).toString()));
        console.log((response.toString()));
        setValue(Math.floor((response.toString()/10**12))/10**6);
    } catch (err) {
      console.log("error: ", err);
    }
  }
  }

  async function handleMint() {
    const regUser = document.getElementById('addUser').value;
    const amount = document.getElementById('totalAmt').value;
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TSMAddress,
        TSM.abi,
        signer
      );
      try {
        var valid = true;
        var response;
        const options = {value: ethers.utils.parseEther((amount).toString())};
        try {
          ethers.utils.getAddress(regUser)
        } catch(err){
          valid = false
        }
        console.log(valid)
        if (!valid)
          response = await contract.ethBuyWithoutRef(options);
        else
          response = await contract.ethBuyWithRef(regUser, options);
        return ("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  return (
    <div>
    <Flex justify="center" align="center" height="20vh" >
      <Box width="520px">
        <div>
          <Text fontSize="48px">Token Sale Machine </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
          >
            This website is for demo purposes only.
          </Text>
        </div>
      </Box>
    </Flex>
    <Flex justify="center" align="center" height="25vh">
      <div>
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
              > Check User Address
          </Button>
          <p>
              {verified}
          </p>

          <Input
              name="amount"
              fontFamily="inherit"
              id="addUser"
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
              onClick = {addUser}
              > Add User Address
          </Button>
          <p>
              {addedUser}
          </p>

          
      </div>
    </Flex>
    <Flex justify="center" align="center" height="25vh">
      {isConnected ? (
        <div>
          <Button
            backgroundColor="#008fd4"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="10"
            onClick={Count}
          >
            Get token amount: {value}
          </Button>

          <Flex justify="center" align="center">
            <Input
              name="amount"
              fontFamily="inherit"
              id="totalAmt"
              width="200px"
              height="40px"
              textAlign="center"
              paddingLeft="19px"
              marginTop="10px"
              type="number"
              step="0.01"
            />
          </Flex>

          <Button
            backgroundColor="#008fd4"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="10"
            onClick={handleMint}
          >
            Buy Now
          </Button>
        </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="5.5%"
            fontFamily="VT323"
            color="#008fd4"
          >
            Connect your wallet to mint.
          </Text>
        )}
    </Flex>
    </div>
  );
};

export default MaintMint;