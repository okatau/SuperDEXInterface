// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IToken is IERC20{
    
    function mint(address buyer, uint256 buyerAmount, address referal, uint256 referalAmount) external;

    function mint(address buyer, uint256 buyerAmount) external;

    function burn(address burner, uint256 burnAmount) external;
}