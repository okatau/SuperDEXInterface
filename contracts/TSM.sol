// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./Oracle.sol";
import "./Verifiyer.sol";
import "./Token.sol";

contract TSM is MultiWordConsumer, Verifiyer{
    using SafeMath for uint256;

    // address private Oracle;
    address private DEFAULT_REF;
    Token public token;
    address payable private SPLIT_ADDRESS;

    constructor(address _token) MultiWordConsumer(){
        token = Token(_token);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(keccak256("USER_REGISTER_ROLE"), msg.sender);
        addUser(msg.sender);
        SPLIT_ADDRESS = payable(msg.sender);
        DEFAULT_REF = msg.sender;
    }

    function mint(address buyer, address ref, uint256 amount) internal {
        token.mint(buyer, amount, ref, amount.div(25));
    }
    
    function ethBuy(address ref) external payable{
        require(verified[msg.sender], "You're not verified"); 
        uint256 amount = amountToSend(msg.value.mul(ETH_USD)); 
        SPLIT_ADDRESS.transfer(msg.value);
        if (verified[ref])
            mint(msg.sender, ref, amount);
        else
            mint(msg.sender, DEFAULT_REF, amount);
    }

    function stableBuy(address ref, address _token, uint256 amount) external payable onlyVerifiedToken(_token) {
        require(verified[msg.sender], "You're not verified"); 
        IERC20(token).transferFrom(msg.sender, SPLIT_ADDRESS, amount);
        if (verified[ref] && msg.sender != ref)
            mint(msg.sender, ref, amount * 10**18);
        else
            mint(msg.sender, DEFAULT_REF, amount * 10**18);
    }

    function ethBuyAmount() external payable{
        require(verified[msg.sender], "You're not verified"); 
        // require(msg.value == am*10**17);
        uint256 amount = amountToSend(msg.value.mul(ETH_USD));
        SPLIT_ADDRESS.transfer(msg.value);
        mint(msg.sender, DEFAULT_REF, amount); 
    }

    function amountToSend(uint256 _amountUSD) public view returns(uint256){
        uint256 a = token.totalSupply();
        return (Math.sqrt(_amountUSD * 2 * 5 + a * a) - a);
    } 

    function balance() external view returns(uint256){
        return address(this).balance;
    }

    function OneTokenPrice() external view returns(uint256){
        uint256 a = token.totalSupply();
        uint256 b = a + 10**18;
        return (b**2 - a**2).div(2*5).div(10**18);
    }

    function recieve() external payable{ }
}