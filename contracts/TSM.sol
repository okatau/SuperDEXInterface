// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "./Oracle.sol";
import "./Verifiyer.sol";
import "./Token.sol";
import "./Freezer.sol";

// contract TSM is MultiWordConsumer, Verifiyer{
contract TSM is Verifiyer{
    using SafeMath for uint256;

    uint256 public ETH_USD = 2*10**3;
    Token public token;

    address private FREEZER;
    address payable private FAUCET;
    bool private lock;

    modifier reEntrancyStop(){
        require(!lock, "Stop reEntrancy");
        lock = true;
        _;
        lock = false;
    }

    constructor(address _token) {
        token = Token(_token);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(keccak256("USER_REGISTER_ROLE"), msg.sender);
        FAUCET = payable(msg.sender);
    }

    function SetFaucet(address faucet) external onlyRole(DEFAULT_ADMIN_ROLE){
        FAUCET = payable(faucet);
    }

    function SetFreezer(address freezer) external onlyRole(DEFAULT_ADMIN_ROLE){
        FREEZER = payable(freezer);
    }

    function mintWithRef(address buyer, address ref, uint256 amount) internal returns(bool){
        (bool success, ) = address(token).call(
            abi.encodeWithSignature("mint(address,uint256,address,uint256)",
                buyer,
                amount,
                ref,
                amount.div(25)
            ));
        require(success, "Mint was denied");
        return success;
    }
    
    function mintWithoutRef(address buyer, uint256 amount) internal{
        token.mint(buyer, amount);
    }

    function ethBuyWithRef(address ref) external payable reEntrancyStop(){
        require(verified[msg.sender], "You're not verified"); 
        uint256 amount = amountToSend(msg.value.mul(ETH_USD)); 
        FAUCET.transfer(msg.value);
        if (verified[ref])
            mintWithRef(msg.sender, ref, amount);
        else
        {
            bool success = mintWithRef(msg.sender, FREEZER, amount);
            require(success, "Mint was denied");
            addClaimer(ref);
        }
    }

    function ethBuyWithoutRef() external payable reEntrancyStop(){
        require(verified[msg.sender], "You're not verified"); 
        uint256 amount = amountToSend(msg.value.mul(ETH_USD));
        FAUCET.transfer(msg.value);
        mintWithoutRef(msg.sender, amount); 
    }

    // function stableBuy(address ref, address _token, uint256 amount) external payable onlyVerifiedToken(_token) {
    //     require(verified[msg.sender], "You're not verified"); 
    //     IERC20(token).transferFrom(msg.sender, FAUCET, amount);
    //     if (verified[ref] && msg.sender != ref)
    //         mint(msg.sender, ref, amount);
    //     else
    //         mint(msg.sender, DEFAULT_REF, amount);
    // }

    function amountToSend(uint256 _amountUSD) public view returns(uint256){
        uint256 a = token.totalSupply();
        return (Math.sqrt(_amountUSD * 10**18 * 2 * 5 + a * a) - a);
    } 

    function addClaimer(address claimer) internal{
        Freezer(FREEZER).addClaimer(claimer);
    }

    function withdrawRefFunds() public {
        require(verified[msg.sender], "You're not verified"); 
        // require(Freezer(FREEZER).claimList[msg.sender] > 0, "You haven't token for claim");
        Freezer(FREEZER).withdraw(msg.sender);
    }

    function recieve() external payable{}
}