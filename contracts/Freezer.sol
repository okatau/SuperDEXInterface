// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Freezer {
    using SafeMath for uint256;

    address public TOKEN;  
    mapping (address => uint256) public claimList;
    uint256 private sum; 

    address private TSM;
    address private ADMIN;
    bool private lock = false;

    constructor(address tsm, address _token){
        TOKEN = _token;
        ADMIN = msg.sender;
        TSM = tsm;
    }

    modifier onlyClaimList(address user){
        require(claimList[user] > 0, "You haven't token for X.LA");
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

    modifier isAdmin(address admin){
        require(admin == ADMIN, "You're not Admin");
        _;
    } 

    function changeTSM(address newTSM) external isAdmin(msg.sender){
        TSM = newTSM;
    }

    function addClaimer(address claimer) public isTSM(msg.sender){
        require( IERC20(TOKEN).balanceOf(address(this)) - sum > 0, "User haven't token for Claim");
        claimList[claimer] = IERC20(TOKEN).balanceOf(address(this)) - sum;
        sum = IERC20(TOKEN).balanceOf(address(this));
    }

    function withdraw(address claimer) external onlyClaimList(claimer) reEntrancyStop() {
        (bool success, bytes memory data) = address(TSM).call(
            abi.encodeWithSignature("checkUser(address)", msg.sender)
        );
        require(success, "call is failed");
        bool verified = abi.decode(data, (bool));
        require(verified, "you are not verified");
        uint256 amount = claimList[claimer];
        claimList[claimer] = 0;
        IERC20(TOKEN).transfer(claimer, amount);
    }
}