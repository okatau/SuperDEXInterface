// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITSM {

    function ethBuyWithRef(address ref) external payable;

    function ethBuyWithoutRef() external payable;

    function stableBuy(address ref, address _token, uint256 amount) external payable;

    function amountToSend(uint256 _amountUSD) external view returns(uint256);

    function checkUser(address _user) external view returns(bool);
}