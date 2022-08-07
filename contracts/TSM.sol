// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "./Oracle.sol";
import "./Verifiyer.sol";
import "./Token.sol";

// contract TSM is MultiWordConsumer, Verifiyer{
contract TSM is Verifiyer{
    using SafeMath for uint256;

    uint256 public ETH_USD = 2*10**21;
    Token public token;

    address private DEFAULT_REF;
    address payable private FAUCET;

    constructor(address _token) {
        token = Token(_token);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(keccak256("USER_REGISTER_ROLE"), msg.sender);
        // addUser(msg.sender);
        FAUCET = payable(msg.sender);
        DEFAULT_REF = msg.sender;
    }

    function SetFaucet(address faucet) external onlyRole(DEFAULT_ADMIN_ROLE){
        FAUCET = payable(faucet);
        DEFAULT_REF = payable(faucet);
    }

    function mint(address buyer, address ref, uint256 amount) internal {
        if (ref != DEFAULT_REF)
            token.mint(buyer, amount, ref, amount.div(25));
        else
            token.mint(buyer, amount);
    }
    
    function ethBuyWithRef(address ref) external payable{
        require(verified[msg.sender], "You're not verified"); 
        uint256 amount = amountToSend(msg.value.mul(ETH_USD)); 
        FAUCET.transfer(msg.value);
        if (verified[ref])
            mint(msg.sender, ref, amount);
        else
            mint(msg.sender, DEFAULT_REF, amount);
    }

    function ethBuyWithoutRef() external payable{
        require(verified[msg.sender], "You're not verified"); 
        uint256 amount = amountToSend(msg.value.mul(ETH_USD));
        FAUCET.transfer(msg.value);
        mint(msg.sender, DEFAULT_REF, amount); 
    }

    function stableBuy(address ref, address _token, uint256 amount) external payable onlyVerifiedToken(_token) {
        require(verified[msg.sender], "You're not verified"); 
        IERC20(token).transferFrom(msg.sender, FAUCET, amount);
        if (verified[ref] && msg.sender != ref)
            mint(msg.sender, ref, amount * 10**18);
        else
            mint(msg.sender, DEFAULT_REF, amount * 10**18);
    }

    function amountToSend(uint256 _amountUSD) public view returns(uint256){
        uint256 a = token.totalSupply();
        return (Math.sqrt(_amountUSD * 2 * 5 + a * a) - a);
    } 

    function recieve() external payable{ }
}