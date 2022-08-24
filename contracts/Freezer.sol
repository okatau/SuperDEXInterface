// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interface/ITSM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Freezer {
    address public tokenAddress;  
    mapping (address => uint256) public claimList;
    
    uint256 private balance; 
    address private TSM;
    address private admin;
    bool private lock = false;

    constructor(address _token, address _tsm){
        tokenAddress = _token;
        TSM = _tsm;
        admin = msg.sender;
    }

    modifier onlyClaimList(address user){
        require(claimList[user] > 0, "You haven't token for claim");
        _;
    }

    modifier reEntrancyStop(){
        require(!lock, "Stop reEntrancy");
        lock = true;
        _;
        lock = false;
    }

    modifier isTSM(address tsm){
        require(tsm == TSM, "You're not TSM");
        _;
    } 

    modifier isAdmin(address _admin){
        require(admin == _admin, "You're not Admin");
        _;
    } 

    function changeTSM(address newTSM) external isAdmin(msg.sender){
        TSM = newTSM;
    }

    function addClaimer(address claimer) external isTSM(msg.sender) reEntrancyStop(){
        require(IERC20(tokenAddress).balanceOf(address(this)) - balance > 0, "User has no tokens for Claim");
        uint256 newBalance = IERC20(tokenAddress).balanceOf(address(this)) - balance;
        balance = IERC20(tokenAddress).balanceOf(address(this));
        claimList[claimer] += newBalance;
    }

    function withdraw() external onlyClaimList(msg.sender) reEntrancyStop() {
        bool verified = ITSM(TSM).checkUser(msg.sender);
        require(verified, "you are not verified");
        uint256 amount = claimList[msg.sender];
        claimList[msg.sender] = 0;
        IERC20(tokenAddress).transfer(msg.sender, amount);
    }
}