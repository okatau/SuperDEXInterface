// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./Interface/IToken.sol";
import "./Interface/IFreezer.sol";
import "./Interface/IFaucet.sol";
import "./Verifiyer.sol";

contract TSM is Verifiyer{

    uint256 public ETH_USD = 10**3;
    
    uint256 public k; 
    uint256 public alpha; 
    
    address public token;

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
        alpha = 10**17;
        k = 34500000;
        token = _token;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        FAUCET = payable(msg.sender);
    }

    function updateEthPrice(uint256 _eth_usd) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ETH_USD = _eth_usd;
    }

    function updateY(uint256 _k, uint256 _alpha) external onlyRole(DEFAULT_ADMIN_ROLE) {
        k = _k;
        alpha = _alpha;
    }

    function SetFaucet(address _faucet) external onlyRole(DEFAULT_ADMIN_ROLE){
        FAUCET = payable(_faucet);
    }

    function SetFreezer(address _freezer) external onlyRole(DEFAULT_ADMIN_ROLE){
        FREEZER = payable(_freezer);
    }

    function mintWithRef(address buyer, address ref, uint256 amount) internal{
        IToken(token).mint(buyer, amount, ref, amount / 25);
    }
    
    function mintWithoutRef(address buyer, uint256 amount) internal{
        IToken(token).mint(buyer, amount);
    }

    function ethBuyWithRef(address ref) external payable reEntrancyStop(){
        require(verified[msg.sender], "You're not verified"); 
        require(ref != msg.sender, "You can't list yourself as a referral");
        uint256 amount = amountToSend(msg.value * ETH_USD); 
        (bool success, ) = FAUCET.call{value: msg.value}(abi.encodeWithSignature("Split()"));
        require(success, "Split was wrong");
        if (verified[ref])
            mintWithRef(msg.sender, ref, amount);
        else
        {
            mintWithRef(msg.sender, FREEZER, amount);
            addClaimer(ref);
        }
    }

    function ethBuyWithoutRef() external payable reEntrancyStop(){
        require(verified[msg.sender], "You're not verified"); 
        uint256 amount = amountToSend(msg.value * ETH_USD);
        (bool success, ) = FAUCET.call{value: msg.value}(abi.encodeWithSignature("Split()"));
        require(success, "Split was wrong");
        mintWithoutRef(msg.sender, amount); 
    }

    function amountToSend(uint256 USD) public view returns(uint256){
        uint256 a = IToken(token).totalSupply();
        return (Math.sqrt(USD * 2 * k + (a * k + 10**18 * alpha)**2/10**36) - (k * a + 10**18*alpha)/10**18 )*10**18 / k;
    } 

    function addClaimer(address claimer) internal {
        IFreezer(FREEZER).addClaimer(claimer);
    }

    receive() external payable{}
}