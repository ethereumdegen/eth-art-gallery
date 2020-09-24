pragma solidity ^0.4.22;


/*
The invader token for Matic is a yield farming token that farms the trading fees of the 0xBTC-MATIC pair on Maticswap.

1 Liquidity Pool (LP) token <==> 1 Invader (INV) token
*/


library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    if (a == 0) {
      return 0;
    }
    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender)
    public view returns (uint256);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  function approve(address spender, uint256 value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}


contract InvaderToken {

   using SafeMath for uint;

    address public originalToken;

    string public name     = "Invader";
    string public symbol   = "INV";
    uint8  public decimals = 18;
    uint private _totalSupply;
    uint256 public expansionMultiplier = 1;

    event  Approval(address indexed src, address indexed ext, uint amt);
    event  Transfer(address indexed src, address indexed dst, uint amt);
    event  Mint(address indexed src, uint amt);
    event  Burn(address indexed src, uint amt);

    mapping (address => uint)                       public  balances;
    mapping (address => mapping (address => uint))  public  allowance;


      constructor(address baseToken) public {
          originalToken = baseToken;
      }

     /**
     * Do not allow Matic to enter
     */
      function() external payable
    {
        revert();
    }



    /**
     *
     * @dev Deposit original tokens, receive proxy tokens
     */
    function depositTokens(uint amount) public returns (uint mintedAmount)
    {
        address from = msg.sender;

        require( amount > 0 );

        require( ERC20( originalToken ).transferFrom( from, this, amount) );

        uint expandedAmount = amount.mul(expansionMultiplier);

        balances[from] = balances[from].add(expandedAmount);
        _totalSupply = _totalSupply.add(expandedAmount);

        emit Mint(from,expandedAmount);

        return expandedAmount;
    }



    /**
     * @dev Withdraw original tokens, burn proxy tokens
     */
    function withdrawTokens(uint expandedAmount) public returns (uint withdrawnAmount)
    {
        address from = msg.sender;

        require( expandedAmount > 0 );

        uint amount = expandedAmount.div(expansionMultiplier);

        require( amount > 0 );

        balances[from] = balances[from].sub(expandedAmount);
        _totalSupply = _totalSupply.sub(expandedAmount);

        emit Burn(msg.sender,expandedAmount);

        require( ERC20( originalToken ).transfer( from, amount) );
        return amount;
    }



     function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function approve(address ext, uint amt) public returns (bool) {
        allowance[msg.sender][ext] = amt;
        emit Approval(msg.sender, ext, amt);
        return true;
    }

    function transfer(address to, uint tokens) public returns (bool) {
        address from = msg.sender;
        balances[from] = balances[from].sub(tokens);

        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }


     function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }


}
