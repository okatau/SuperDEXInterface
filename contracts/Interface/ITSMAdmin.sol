// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/IAccessControl.sol";

interface ITSMAdmin is IAccessControl{
    
    function setFaucet(address _faucet) external;

    function setFreezer(address _freezer) external;   

    function addUser(address _user) external;

    function addUsers(address[] calldata users) external;
}