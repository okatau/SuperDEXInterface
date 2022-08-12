pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Faucet is AccessControl{
    using SafeMath for uint256;

    uint256 public TotalBalance;
    uint256 public TotalDisturbed;
    uint256 public decimals = 10**6;
    bool private lock = false;
    mapping (address => uint256) public balance;
    mapping (address => uint256) public percent;
    address[] public Brooks;

    struct Brook{
        address id;
        uint256 percent;
    }

    modifier reEntrancyStop(){
        require(!lock, "Reentrancy Stop!");
        lock = true;
        _;
        lock = false;
    } 

    constructor () {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        addBrook(Brook(msg.sender, decimals));
    }

    function DisturbeFunds() external reEntrancyStop() returns(uint256){
        require(TotalBalance > 0, "You haven't anything to Disturbe");
        uint256 TB = TotalBalance; 
        for(uint256 i = 0; i < Brooks.length; i++){
            address _brook = Brooks[i];
            uint256 amount = TB.mul(percent[_brook]).div(decimals);
            TotalBalance -= amount;
            balance[_brook] += amount;
            TotalDisturbed += amount;
        }
        require(address(this).balance == TotalDisturbed + TotalBalance, "Something went wrong");
        return Brooks.length;
    }

    function clearBrooks() internal returns(bool){
        for (uint256 i = 0; i < Brooks.length; i++) 
            percent[Brooks[i]] = 0;
        for(; Brooks.length > 0;)   
            Brooks.pop();
        require(Brooks.length == 0, "Something went wrong in cler brooks process");
        return Brooks.length == 0;
    }

    function addBrook(Brook memory _brook) internal returns(uint256){
        Brooks.push(_brook.id);   
        percent[_brook.id] = _brook.percent;
        return _brook.percent;
    }

    function updateBrooks(Brook[] calldata _brooks) external onlyRole(DEFAULT_ADMIN_ROLE) returns(uint256){
        bool success = clearBrooks();
        require(success, "error in clear Brooks");
        uint256 sum = 0;
        for (uint256 i = 0; i < _brooks.length; i++)
            sum += addBrook(_brooks[i]);
        require(Brooks.length > 0, "won't update brooks");
        require(sum == decimals, "Sum of percent should be equal 100%");
        return _brooks.length;
    }

    function withdraw() external payable reEntrancyStop() {
        require(balance[msg.sender] > 0, "Your faucet balance is empty");
        uint256 amount = balance[msg.sender];
        TotalDisturbed -= amount;
        balance[msg.sender] = 0;
        require(address(this).balance - amount == TotalDisturbed + TotalBalance, "Something went wrong");
        payable(msg.sender).transfer(amount);
    }

    function recieve() external payable{
        TotalBalance += msg.value;
    }

    // function watchBalance() external view returns(uint256){
    //     return payable(address(this)).balance;
    // }

    function info(address id) external view returns(uint256, uint256){
        return (balance[id], percent[id]);
    } 

    function totalBalance() external view returns(uint256){
        return TotalBalance;
    }
    
    function totalDisturbed() external view returns(uint256){
        return TotalDisturbed;
    }

}