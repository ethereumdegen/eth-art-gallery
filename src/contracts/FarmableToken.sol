pragma solidity >=0.4.22 ;


library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}




// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
}


// ----------------------------------------------------------------------------
// Token Interface = ERC20 + symbol + name + decimals + approveAndCall
// ----------------------------------------------------------------------------
contract TokenInterface is ERC20Interface {
    function symbol() public view returns (string memory);
    function name() public view returns (string memory);
    function decimals() public view returns (uint8);
}





/**
 * @title Farmable Token
 * @dev Farmable ERC20 token. Earn this token by staking another token over time.
 */
contract FarmableToken is TokenInterface {

    using SafeMath for uint;

    string _symbol = "ALN";
    string  _name = "Alien";
    uint8 _decimals = 18;
    uint _totalSupply;

    uint mintingDivisor = 1000000;

    //balances and allowance of the farmable token
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    event Mint(address indexed to, uint tokens);


    mapping (address => TokenVault) public stakedTokens;

    struct TokenVault {
        uint tokenAmount;
        uint blockTimeDeposited;
    }

    address public stakeableToken;

    constructor(address sToken) public
    {
        stakeableToken=sToken;
    }


    function symbol() public view returns (string memory) {
        return _symbol;
    }
    function name() public view returns (string memory) {
        return _name;
    }
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply.sub(balances[address(0)]);
    }
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }



    //Resets the block number in your vault and pays out yield based on the difference to current blocknum.
    //This keeps the 'amount staked' the same but brings the block number forward to the current time.
    function claimYields() public returns (uint256 amt){

        address from = msg.sender;


        uint amountEarned = getYieldAvailable(from);

        //mint new tokens
        require( _mintFarmableToken(amountEarned, from) );



        uint amountStaked = stakedTokens[from].tokenAmount;

        //update only the block number in the token vault, bring it up to the current block
        stakedTokens[from] = TokenVault( amountStaked , block.number );


        return amountEarned;

    }

    function _mintFarmableToken(uint amount, address recipient) internal returns (bool)
    {
        balances[recipient] = balances[recipient].add(amount);
        _totalSupply.add(amount);

        emit Mint(recipient,amount);

        return true;

    }



     /**
     * @dev Users can stake their tokens, requires preApproval.  Forces a claim of yield.
     */
    function stakeTokens(uint amount) public returns (uint256 amt){

        require( amount > 0 );

        address from = msg.sender;
        uint blockNum = block.number;


        //forcibly claim yields here to reset the block number
        claimYields();

        //require that there are no yields to claim, that the block number in the vault is current
        require(  stakedTokens[from].blockTimeDeposited == blockNum );



        //transfer the stakeable tokens into this contract and record that fact in the vault
        require( ERC20Interface(stakeableToken).transferFrom(from, address(this), amount) ) ;


        //record these newly staked tokens to the vault
        uint newAmountStaked = stakedTokens[from].tokenAmount.add(amount);

        stakedTokens[from] = TokenVault( newAmountStaked , blockNum );


        return amount;
    }

    /**
     * @dev Users can unstake their tokens. Forces a claim of yield.
     */
    function unstakeTokens(uint amount) public returns (uint amt){

        require( amount > 0 );

        address from = msg.sender;
        uint blockNum = block.number;

        uint amountRemainingInVault = stakedTokens[from].tokenAmount.sub(amount);

        //dont allow for negative vault balance
        require(amountRemainingInVault >= 0);

        //forcibly claim yields here to reset the block number
        claimYields();

        //require that there are no yields to claim, that the block number in the vault is current
        require(  stakedTokens[from].blockTimeDeposited == blockNum );


        require( ERC20Interface(stakeableToken).transfer(from, amount) ) ;

        stakedTokens[from] = TokenVault( amountRemainingInVault , blockNum );

        return amount;
    }

    function getStakedTokenBalance(address accountAddress) public view returns (uint amt)
    {
        return stakedTokens[accountAddress].tokenAmount;
    }

    function getYieldAvailable(address accountAddress) public view returns (uint amt)
    {
        uint originBlockNumber = stakedTokens[accountAddress].blockTimeDeposited;

        if( originBlockNumber == 0  ) return 0;


        uint blockDelta = block.number.sub(originBlockNumber);

        uint amountStaked = stakedTokens[accountAddress].tokenAmount;

        uint amountEarned = blockDelta.mul(amountStaked).div(mintingDivisor);

        return amountEarned;
    }

}
