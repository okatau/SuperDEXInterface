// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFreezer{

    function changeTSM(address newTSM) external;

    function withdraw(address claimer) external;

    function addClaimer(address claimer) external;

    function withdraw() external;
    function claimList(address _addr) external;
}