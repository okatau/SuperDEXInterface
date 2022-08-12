pragma solidity ^0.8.0;

interface IFaucet{
    
    struct Brook{
        address id;
        uint256 percent;
    }

    function withdraw() external returns(uint256);

    function updateBrooks(Brook[] memory _brooks) external returns(uint256);

    function DisturbeFunds() external returns(uint256);

    function recieve() external payable;

    function info(address id) external view returns(uint256, uint256);

    function totalBalance() external view returns(uint256);

    function totalDisturbed() external view returns(uint256);
}