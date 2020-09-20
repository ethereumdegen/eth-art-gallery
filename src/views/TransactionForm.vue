
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


          <button  class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Withdraw From {{currentDomainName()}}
          </button>


        </div>

        <div v-if="activeWalletDomain=='matic'">

          <input type="text" v-model="depositAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>

          <button  class="bg-white text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Deposit To {{currentDomainName()}}
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

      transferTo:null,
      transferAmount:null,
      approveTo:null,
      approveAmount:null,
      formMode: "none",
      currentBalance: '0.0',

      txError: null,
      loading: false,
      networkProviderIdError: null
    }
  },
  mounted()
  {

    this.updateAll();
    setTimeout(this.updateFormMode, 2000);
    setTimeout(this.updateBalance, 2000);
  },
  updated()
  {

    this.updateAll();
  },
  methods: {
    updateAll()
    {
        console.log('form updated')
      this.updateFormMode();
      this.updateBalance();
    },
    currentDomainName(){
      if(this.activeNetwork == "matic"){ return "Matic Network" }else{ return "Tip Jar" }
    },
    otherDomainName(){
      if(this.activeNetwork == "matic"){ return "Tip Jar" }else{ return "Matic Network" }
    },
    checkNetworkProviderIdValid(){

      if(this.activeNetwork == "ethereum")
      {
        if(this.providerNetworkID != Web3Helper.ethereumChainID())
        {
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call these methods."
          return false
        }
      }

      //this.networkProviderIdError = null;
      return true;
    },
    async updateBalance()
    {

      if(this.activeWalletDomain == "tipjar"){
          //get balance in the tipjar contract
      }

      if(this.activeWalletDomain == "matic"){
        var web3provider = new Web3(Web3.givenProvider || 'ws://localhost:8546');
        var userAddress = this.acctAddress;

        var maticClient = MaticHelper.getMaticPOSClient(web3provider,userAddress);
        var balanceRaw = await maticClient.balanceOfERC20(
          userAddress,
          CryptoAssets.assets[this.assetName]['MaticContract'],
          {}

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


        }

        this.checkNetworkProviderIdValid()


    },

    async standardApprove()
    {

      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.approveAmount, CryptoAssets.assets[this.assetName]['Decimals']);



      if(this.activeNetwork == "ethereum"){
        if(this.providerNetworkID == 0x1){

          var contractAddress = CryptoAssets.assets[this.assetName]['EthereumContract'];


          var tokenContract = await Web3Helper.getTokenContract(web3,contractAddress,userAddress);

          tokenContract.approve(this.approveTo,amt).send({from: userAddress})
          .then(function(receipt){
              // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          });

        }else{
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call this method."
        }
      }

      if(this.activeNetwork == "matic"){
        if(this.providerNetworkID == 0x89){

          var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


          var tokenContract = await Web3Helper.getTokenContract(web3,contractAddress,userAddress);

          tokenContract.approve(this.approveTo,amt).send({from: userAddress})
          .then(function(receipt){
              // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          });

        }else{
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call this method."
        }
      }
    },
    async standardTransfer()
    {
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;

      var amt  = Web3Helper.formattedAmountToRaw(this.transferAmount, CryptoAssets.assets[this.assetName]['Decimals']);



      if(this.activeNetwork == "ethereum"){
        if(this.providerNetworkID == 0x1){

          var contractAddress = CryptoAssets.assets[this.assetName]['EthereumContract'];


          var tokenContract = await Web3Helper.getTokenContract(web3,contractAddress,userAddress);

          console.log(tokenContract)
          console.log('meep',tokenContract.methods)

          tokenContract.transfer(this.approveTo,amt).send({from: userAddress})
          .then(function(receipt){
              // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          });

        }else{
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call this method."
        }
      }

      if(this.activeNetwork == "matic"){
        if(this.providerNetworkID == 0x89){

          var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


          var tokenContract = await Web3Helper.getTokenContract(web3,contractAddress,userAddress);
          tokenContract.transfer(this.approveTo,amt).send({from: userAddress})
          .then(function(receipt){
              // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          });

        }else{
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call this method."
        }
      }
    }



  }
}
</script>
