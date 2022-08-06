// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Token is ERC20, AccessControl{

    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");
    event MinterInitialized(address indexed minter);

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) { 
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address buyer, uint256 buyerAmount, address referal, uint256 referalAmount) external onlyRole(MINTER_ROLE) {
        _mint(buyer, buyerAmount);
        _mint(referal, referalAmount);
    }
}