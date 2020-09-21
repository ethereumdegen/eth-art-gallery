
<template>
    <div class="">
      <h3 class="text-lg font-bold">Wallet Balance ({{currentDomainName()}})</h3>

      <div class="p-12 text-xl w-full text-center">
        {{currentBalance}} {{assetName}}
      </div>

      <div>

        <div v-if="networkProviderIdError" class="p-8 bg-red-200">
          {{networkProviderIdError}}
        </div>

        <div class="p-6 bg-gray-500 w-full text-sm">

        <div v-if="activeWalletDomain=='tipjar'">

          <input type="text" v-model="withdrawAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>


          <button @click="withdrawFromTipjar" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Withdraw From {{currentDomainName()}}
          </button>


        </div>

        <div v-if="activeWalletDomain=='matic'">

          <input v-on:keyup="updateFormMode" type="text" v-model="depositAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>

          <button @click="approveToTipjar" v-if="!approvedEnoughToDeposit" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Approve To {{otherDomainName()}}
          </button>

          <button @click="depositToTipjar" v-if="approvedEnoughToDeposit" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Deposit To {{otherDomainName()}}
          </button>


        </div>


          <div class="m-4">
            <div v-if="txError">{{txError}}</div>

          </div>

        </div>






      </div>
    </div>
</template>

<script>

import Web3Helper from '../js/web3-helper.js'
import MaticHelper from '../js/matic-helper.js'
import CryptoAssets from '../js/cryptoassets.js'

export default {
  name: 'TransactionForm',
  props: ['activeWalletDomain','acctAddress','assetName','providerNetworkID'],
  data() {
    return {

      withdrawAmount:0,
      depositAmount:0,

    //  depositAmount:0,
      approvedEnoughToDeposit: false,

      currentBalance: '0.0',

      txError: null,
      loading: false,
      networkProviderIdError: null
    }
  },
  mounted()
  {

    //this.updateAll();
  //  setTimeout(this.updateFormMode, 2000);
    setTimeout(this.updateBalance, 2000);

    setInterval(this.updateFormMode, 6000);
  },
  updated()
  {

    this.updateAll();
  },
  methods: {
    updateAll()
    {
        console.log('form updated')
      // this.updateFormMode();
       this.updateBalance();
    },
    currentDomainName(){
      if(this.activeWalletDomain == "matic"){ return "Matic Network" }else{ return "Tip Jar" }
    },
    otherDomainName(){
      if(this.activeWalletDomain == "matic"){ return "Tip Jar" }else{ return "Matic Network" }
    },
    checkNetworkProviderIdValid(){


        if(this.providerNetworkID != Web3Helper.maticChainID())
        {
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call these methods."
          return false
        }


      //this.networkProviderIdError = null;
      return true;
    },
    async updateBalance()
    {

      console.log('update balance')
      if(this.activeWalletDomain == "tipjar"){
        var web3provider = new Web3(Web3.givenProvider || 'ws://localhost:8546');
        var userAddress = this.acctAddress;

         var balanceRaw = await Web3Helper.getTipjarTokensBalance(
          CryptoAssets.assets[this.assetName]['MaticContract'],
          userAddress
        )
        this.currentBalance =  Web3Helper.rawAmountToFormatted(balanceRaw, CryptoAssets.assets[this.assetName]['Decimals']);

      }

      if(this.activeWalletDomain == "matic"){
        var web3provider = new Web3(Web3.givenProvider || 'ws://localhost:8546');
        var userAddress = this.acctAddress;

         var balanceRaw = await Web3Helper.getMaticTokensBalance(
          CryptoAssets.assets[this.assetName]['MaticContract'],
          userAddress
        )
        this.currentBalance =  Web3Helper.rawAmountToFormatted(balanceRaw, CryptoAssets.assets[this.assetName]['Decimals']);

      }

    },
    async updateFormMode()
    {
      console.log('updateFormMode');



        if(this.activeWalletDomain == "tipjar"){


        }


        if(this.activeWalletDomain == "matic"){
          //check to see how many are approved to the tipjar
          console.log('has enough allowance?', this.acctAddress,this.assetName,this.depositAmount)

          var spenderAddress = await Web3Helper.getTipjarContractAddress();

          var hasAllowance = await Web3Helper.hasEnoughAllowance(this.acctAddress,spenderAddress,this.assetName,this.depositAmount)

          this.approvedEnoughToDeposit = hasAllowance;
        }

      //  this.checkNetworkProviderIdValid()


    },

    async approveToTipjar()
    {
      console.log('approve to tip jar')
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.depositAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var tipjarContractAddress = await Web3Helper.getTipjarContractAddress();

      var tokenContract = await Web3Helper.getTokenContract(web3,tokenAddress,userAddress)

      console.log(tipjarContractAddress,amt)

      tokenContract.approve(tipjarContractAddress,amt).send()
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },


    async depositToTipjar()
    {
      console.log('deposit to tip jar')
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.depositAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


      var tipjarContract = await Web3Helper.getTipjarContract(web3);

      console.log(tokenAddress,amt)

      tipjarContract.depositTokens(tokenAddress,amt).send()
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },
    async withdrawFromTipjar()
    {

      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.withdrawAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


      var tipjarContract = await Web3Helper.getTipjarContract(web3);

      tipjarContract.withdrawTokens(tokenAddress,amt).send({from: userAddress})
      .then(function(receipt){
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },


  }
}
</script>
