import { ethers, BigNumber } from "ethers";
import PayloadABI from "./../abi/PayloadABI.json"
const PayloadAddress = "0x0C580D4ac2bA0484cAFE92921A4eea464E6501e8";

export async function payload(data){
    console.log("payload");
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            PayloadAddress,
            PayloadABI,
            signer
        );
    try {
        let response = await contract.ancodePayload(data);
        console.log(response);
        return (response);
    } catch (err) {
        console.log("error: ");
        }
    }
}

// export default payload;