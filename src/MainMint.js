import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Spacer, Input, Text } from "@chakra-ui/react";
import TSM from "./abi/ITSM.json";

const TSMAddress = "0x077a1A7F8822168fDD1c0e1332C9114721A1dCfd";



const MaintMint = ({ accounts, setAccounts }) => {
  // const [ethAmount, setEthAmount] = useState(0);
  const [value, setValue] = useState(0);
  const isConnected = Boolean(accounts[0]);
  
  const handleChange = (amount) => {
    if (amount <= 0 )
      alert("Amount should be greater then 0");  
  };

  async function Count(){
    if (window.ethereum) {
      const amount = document.getElementById('totalAmt').value;
      handleChange(amount);
    const decimals = 18;
    const num = BigNumber.from(amount*2000).mul(BigNumber.from(10).pow(decimals));
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      TSMAddress,
      TSM.abi,
      signer
    );
    try {
      let response = await contract.amountToSend(num);
        console.log(response.toString());
        setValue(response.toString());
    } catch (err) {
      console.log("error: ", err);
    }
  }
  }

  async function handleMint() {
    const amount = document.getElementById('totalAmt').value;
    if (window.ethereum) {
      const amount = document.getElementById('totalAmt').value;
      handleChange(amount);
      const decimals = 18;
      const num = BigNumber.from(amount*2000).mul(BigNumber.from(10).pow(decimals));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TSMAddress,
        TSM.abi,
        signer
      );

      try {
        // console.log((ethAmount*10**18).toString());
        const response = await contract.ethBuyWithoutRef({
            value: ethers.utils.parseEther((amount).toString()),

          });
        return ("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  return (
    <Flex justify="center" align="center" height="70vh" paddingBottom="150px">
      <Box width="520px">
        <div>
          <Text fontSize="48px" textShadow="0 5px #000000">
            Token Sale Machine 
          </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000000"
          >
            This website is for demo purposes only.
          </Text>
        </div>


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
            textShadow="0 3px #000000"
            color="#008fd4"
          >
            Connect your wallet to mint.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MaintMint;