/* eslint-disable */

//https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
const tokenContractABI = require('../abi/ERC20ABI.json')
const config = require('./config-0xbtc.js')

const CryptoAssets = require ('./cryptoassets.js')

const BigNumber = require('bignumber.js');

const Web3 = require('web3');
const web3utils = Web3.utils;
//var max_target = web3utils.toBN( 2 ).pow( web3utils.toBN( 234 ) ) ;


var helper = {

  init(){
    console.log('init web3 helper')

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
    // returns incorrectly formatted chain ID values.
    let currentChainId = window.ethereum.chainId;

    window.ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }
  },

  ethereumChainID()
  {
    return 0x1
  },
  maticChainID()
  {
    return 0x89
  },

  async getConnectedAccounts()
  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  },

  async getProviderNetworkID()
  {
    var net_id = await  window.ethereum.chainId;
    console.log('net id is', net_id)
    return net_id;
  },
  async getTokenContract(web3, contractAddress, fromAddress)
  {

    var tokenContract =  web3.eth.contract(tokenContractABI).at(contractAddress)

    return tokenContract;
  },

  async hasEnoughAllowance(acctAddress,assetName,swapAmountFormatted)
  {

        var numApproved = await this.getTokensAllowance(CryptoAssets.assets[assetName]['EthereumContract'], CryptoAssets.assets[assetName]['EthereumPredicateContract'],acctAddress )


        console.log('num swapping ', swapAmountFormatted)

        var numApprovedFormatted = this.rawAmountToFormatted(numApproved,CryptoAssets.assets[assetName]['Decimals'])

          console.log('num Approved ',assetName, numApproved)
          console.log('num Approved f ', numApprovedFormatted)

      return  ( parseFloat(numApprovedFormatted) > parseFloat(swapAmountFormatted) )


  },
  async getTokensAllowance(tokenAddress, spender, ownerAddress)
  {

    var web3 = new Web3(config.root.RPC);


    var tokenContract = new web3.eth.Contract(tokenContractABI, tokenAddress, {});


    var allowance = await tokenContract.methods.allowance(spender,ownerAddress).call();

    return allowance;
  },

  async getTokensBalance(tokenAddress, ownerAddress)
  {

    var web3 = new Web3(config.root.RPC);


    var tokenContract = new web3.eth.Contract(tokenContractABI, tokenAddress, {});


    var allowance = await tokenContract.methods.balanceOf(ownerAddress).call();

    return allowance;
  },

  rawAmountToFormatted(amount,decimals)
  {
    console.log('formatting',amount,decimals)
    return (amount * Math.pow(10,-1 * decimals)).toFixed(decimals);
  },

  formattedAmountToRaw(amountFormatted,decimals)
  {

    var multiplier = new BigNumber( 10 ).exponentiatedBy( decimals ) ;


    return multiplier.multipliedBy(amountFormatted).toFixed() ;
  },

  async connect()
  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts
  },

  async disconnect()
  {
    console.log('disconnecting')
    const accounts = await window.ethereum.request({
     method: "eth_requestAccounts",
     params: [
       {
         eth_accounts: {}
       }
     ]
   });
   window.location.reload();
  }
}

export default helper
