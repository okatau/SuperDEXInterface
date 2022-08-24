// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/IAccessControl.sol";

interface IFaucet is IAccessControl{
    
    struct Brook{
        address id;
        uint256 percent;
    }

    function withdraw() external returns(uint256);

    function updateBrooks(Brook[] memory _brooks) external returns(uint256);

    function DistributeFunds() external returns(uint256);

    function recieve() external payable;

    function info(address _addr) external view returns(uint256, uint256);

    function TotalBalance() external view returns(uint256);

    function TotalDistributed() external view returns(uint256);

    function Split() external payable;
}