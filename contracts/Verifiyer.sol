// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Verifiyer is AccessControl{
    mapping (address => bool) public verified;
    mapping (address => bool) public avaiableStableCoin;

    bytes32 private USER_REGISTER_ROLE = keccak256("USER_REGISTER_ROLE");
    bytes32 private TOKEN_REGISTER_ROLE = keccak256("TOKEN_REGISTER_ROLE");

    modifier onlyVerifiedToken(address _token){
        require (avaiableStableCoin[_token], "Token's not avaiable to pay for token");
        _;
    }

    function addUser(address user) public onlyRole(USER_REGISTER_ROLE) {
            verified[user] = true;
    }

    function addUsers(address[] memory users) public onlyRole(USER_REGISTER_ROLE) {
        for(uint256 i; i < users.length; i++)
            verified[users[i]] = true;
    }


    function removeUsers(address[] memory users) public onlyRole(USER_REGISTER_ROLE) {
        for(uint256 i; i < users.length; i++)
            verified[users[i]] = false;
    }

    function addStableCoins(address[] memory tokens) public onlyRole(TOKEN_REGISTER_ROLE) {
        for(uint256 i; i < tokens.length; i++)
            avaiableStableCoin[tokens[i]] = true;
    }

    function removeStableCoins(address[] memory tokens) public onlyRole(TOKEN_REGISTER_ROLE) {
        for(uint256 i; i < tokens.length; i++)
            avaiableStableCoin[tokens[i]] = false;
    }
}