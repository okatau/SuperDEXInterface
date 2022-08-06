// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ITSM {
    function ethBuy(address ref) external payable;

    function stableBuy(address ref, address _token, uint256 amount) external payable;

    function OneTokenPrice() external view returns(uint256);

    function amountToSend(uint256 _amountUSD) external view returns(uint256);

    function ethBuyAmount(uint256 am) external payable;
}