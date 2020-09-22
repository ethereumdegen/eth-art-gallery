
<template>
    <div class="">
      <h3 class="text-lg font-bold">Wallet Balance ({{currentDomainName()}})</h3>

      <div class="p-12 text-xl w-full text-center">
        {{currentBalance}} {{getAssetNickname()}}
      </div>

      <div>

        <div v-if="networkProviderIdError" class="p-8 bg-red-200">
          {{networkProviderIdError}}
        </div>


        <div v-if="assetName=='AlienToken'">


          <div class=" p-6 bg-green-500 w-full text-sm">

            <div class="p-4 text-md w-full text-center">

              <div> Estimated Alien Earnings: {{ estimatedAlienEarnings  }}</div>
            </div>





          <br>

          <button @click="mintAliens" class="bg-white text-sm text-green-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Mint Aliens from Staked Invader
          </button>



          </div>

          <div class="p-6 my-2 bg-gray-500 w-full text-sm">

            <div class="p-4 text-md w-full text-center">
              <div> Staked Invader Balance: {{ stakedInvader  }}</div>

            </div>

            <input type="text" v-model="unstakeAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>


          <button @click="unstakeInvaderFromAlien" class="bg-white text-sm text-green-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Unstake Invader
          </button>

          </div>
        </div>

        <div v-if="assetName=='InvaderToken'">



          <div class="my-6 p-6 bg-green-500 w-full text-sm">

          <input type="text" v-model="stakeAmount" v-on:keyup="updateFormMode" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>

          <button @click="approveInvaderToAlien" v-if="!approvedEnoughToDeposit" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Approve Invader To Stake
          </button>

          <button @click="stakeInvaderToAlien" v-if="approvedEnoughToDeposit" class="bg-white text-sm text-green-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Stake Invader to Farm Aliens
          </button>



          </div>

          <div class="p-6 bg-gray-500 w-full text-sm">

          <input type="text" v-model="withdrawAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>


          <button @click="withdrawFromInvader" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Withdraw LP Token From Invader
          </button>

          </div>
        </div>

        <div v-if="assetName=='0xBTC_LP_Token'">

          <div class="p-6 bg-gray-500 w-full text-sm">

          <input v-on:keyup="updateFormMode" type="text" v-model="depositAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>

          <button @click="approveToInvader" v-if="!approvedEnoughToDeposit" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Approve LP Token To Invader
          </button>

          <button @click="depositToInvader" v-if="approvedEnoughToDeposit" class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Deposit LP Token To Invader
          </button>


        </div>


        </div>

        <div class="m-4">
          <div v-if="txError">{{txError}}</div>

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
      approvedEnoughToDeposit: false,

      stakeAmount: 0,
      unstakeAmount: 0,

      estimatedAlienEarnings: 0,
      stakedInvader:0,


      currentBalance: '0.0',

      txError: null,

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
    getAssetNickname(){
       return CryptoAssets.assets[this.assetName]['Nickname'];
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




        if(this.assetName == "0xBTC_LP_Token"){
          //check to see how many are approved to invader
          console.log('has enough allowance?', this.acctAddress,this.assetName,this.depositAmount)

          var spenderAddress = await Web3Helper.getInvaderContractAddress();

          var amt = this.depositAmount;

          var hasAllowance = await Web3Helper.hasEnoughAllowance(this.acctAddress,spenderAddress,this.assetName,amt)

          this.approvedEnoughToDeposit = hasAllowance;
        }



        if(this.assetName == "InvaderToken"){
          //check to see how many are approved to alien
          console.log('has enough allowance?', this.acctAddress,this.assetName,this.stakeAmount)

          var spenderAddress = await Web3Helper.getAlienContractAddress();

          var amt = this.stakeAmount;

          var hasAllowance = await Web3Helper.hasEnoughAllowance(this.acctAddress,spenderAddress,this.assetName,amt)

          this.approvedEnoughToDeposit = hasAllowance;
        }




      //  this.checkNetworkProviderIdValid()


    },

    async approveToInvader()
    {
      console.log('approve to invader')
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.depositAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var invaderContractAddress = await Web3Helper.getInvaderContractAddress();

      var tokenContract = await Web3Helper.getTokenContract(web3,tokenAddress,userAddress)

      console.log(invaderContractAddress,amt)

      tokenContract.approve(invaderContractAddress,amt).send()
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },


    async depositToInvader()
    {
      console.log('deposit to invader')
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.depositAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      //var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


      var invaderContract = await Web3Helper.getInvaderContract(web3);

      console.log(amt)

      invaderContract.depositTokens(amt).send()
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },
    async withdrawFromInvader()
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


      var invaderContract = await Web3Helper.getInvaderContract(web3);

      invaderContract.withdrawTokens(amt).send({from: userAddress})
      .then(function(receipt){
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },
    async approveInvaderToAlien()
    {

      this.networkProviderIdError=null;

      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.stakeAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var invaderContract = await Web3Helper.getInvaderContract(web3);

      var alienContractAddress = await Web3Helper.getAlienContractAddress()


      invaderContract.approve(alienContractAddress,amt).send()
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });



    },
    async stakeInvaderToAlien()
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


    },
    async unstakeInvaderFromAlien()
    {

    },
    async mintAliens()
    {

    }

  },

}
</script>
