<template>
    


        <div id="action-container" class="action-container box  bg-gray-600 px-8" v-cloak v-if="shouldRender && selectedActionAsset"    >
          
         
         
          <div class="tabs flex flex-col sm:flex-row select-none">

            <div class="tab bg-gray-700 text-gray-300 py-4 px-6 block hover:text-blue-500 focus:outline-none cursor-pointer"  
            v-bind:class="{   'text-blue-500 bg-gray-800':(selectedActionType=='permit')  } " 
            @click="selectAction('permit')"
            >

 
                  <a>
                    <div class="icon is-small inline">   <i class="material-icons">file_download</i> </div>
                    <div class="inline ">Permit For Lava</div>
                  </a>
                 

                 </div>

                   <div class="tab bg-gray-700 text-gray-300 py-4 px-6 block hover:text-blue-500 focus:outline-none cursor-pointer" 
                    v-bind:class="{   'text-blue-500 bg-gray-800':(selectedActionType=='lavatransfer')  } " 
                   @click="selectAction('lavatransfer')"
                    >


            <a>
                    <div class="icon is-small one-third inline"> <i class="material-icons">fast_forward</i> </div>
                    <div class="inline " >Lava Transfer</div>
                  </a>
                
 
            </div>   


            </div>

         <!-- 
          <div class="deposit-container" v-if="(selectedActionType=='deposit')" v-cloak>


              <div class="subtitle-banner has-background-info has-text-light"> External Balance: {{ selectedActionAsset.wallet_balance_formatted }} </div>








             <div class="input-container padding-md" v-if="!supportsDelegateCallDeposit">
               <div class="label">Deposit Tokens</div>

                 <div class="columns">
                     <div class="column">
                       <div class="form-group">
                         <input class="w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" v-model="depositTokenQuantity" placeholder="token amount">
                          <div class="button is-primary btn-action-deposit"> Deposit </div>
                       </div>
                      </div>
                    <div class="column">

                    </div>
               </div>
             </div>

             <div class="input-container padding-md" v-if="supportsDelegateCallDeposit">
               <div class="label">Deposit Tokens</div>

                 <div class="columns">
                     <div class="column">
                       <div class="form-group">
                         <input class="w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" v-model="approveAndDepositTokenQuantity" placeholder="token amount">
                          <div class="button is-primary btn-action-approve-and-deposit"> Deposit </div>
                       </div>
                      </div>
                    <div class="column">

                    </div>
               </div>
             </div>



          </div>
          -->
          <div class="approve-container m-4 p-4" v-if="(selectedActionType=='permit')" v-cloak>

           
            <div class="input-container padding-md"   >
              <div class="label">Approve Tokens</div>

              <div class="flex flex-row">
                <div class=" flex-grow ">
                  <div class="form-group">
                      <input type="text" class=" hidden h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline " v-model="permitTokenQuantity" placeholder="token amount">
                      <div class="button inline-block bg-green-500 hover:bg-green-700 text-white font-bold m-2 py-2 px-4 rounded cursor-pointer" v-on:click="actionPermitTokens"> Permit All </div>
           
                  </div>
                </div>
                <div class="  flex-grow">
                    <div> Meta Packet </div> 
                    <textarea class="text-black" v-model="permitMetaData"></textarea>
                 </div>

                 
                <div class="  flex-grow">
                    

                      <div class="button inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold m-2 py-2 px-4 rounded cursor-pointer" v-if="permitMetaData" v-on:click="actionSubmitPermit"> Submit Meta Tx </div>

                      <div class="loader inline-block" v-if="pendingTransaction">  </div>



                 </div>
             </div>
                
            </div>



          </div>


          <div class="lava-transfer-container  m-4 p-4" v-if="(selectedActionType=='lavatransfer')" v-cloak>

             
            <div class=" ">
            

              <p> Generate a signed Lava Transfer Message.  This message can be submitted to the Ethereum network by anyone, at which point the tokens will be transferred to the recipient's account.  </p>


              <div class="whitespace-sm"></div>


                <div class="flex flex-row w-full">
                    <div class="w-1/2 p-4">



                      <div class="form-group padding-md">
                          <div class="label">Method</div>

                         <div class="select">
                            <select class=" " onchange=" " v-model="transferTokenMethod" placeholder="">
                              <option>transfer</option>
                              <option>approveAndCall</option>
                           </select>
                         </div>
                      </div>

                      <div class="form-group padding-md">
                          <div class="label">Amount</div>
                          <input class="w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" v-model="transferTokenQuantity" placeholder="token amount">
                      </div>

                      <div class="form-group padding-md">
                          <div class="label">Recipient</div>
                          <input class="w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" v-model="transferTokenRecipient" placeholder="token recipient">
                      </div>


                      <div class="form-group padding-md">
                          <div class="label">Relay Authority</div>

                         <div class="select">
                            <select class=" " onchange=" " v-model="relayAuthorityType" placeholder="">
                              <option>any relayers</option>
                           </select>
                         </div>
                      </div>

                      <div class="form-group padding-md">
                          <div class="label">Relay Reward (tokens)</div>
                          <div><span> Optional </span></div>
                          <input class="w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" v-model="transferTokenRelayReward" placeholder="token relay reward">
                      </div>

                      <div class="whitespace-sm"></div>
                        
                         <div class="button inline-block bg-green-500 hover:bg-green-700 text-white font-bold m-2 py-2 px-4 rounded cursor-pointer" v-on:click="actionSignLavaPacket"> Sign </div>
           

                     </div>
                   <div class="w-1/2 p-4 ">

                       
                        

                       <div class="is-size-6">   </div>

                       <p v-if="lavaMetadata"> Specify the URL for a Lava Network Node and broadcast this packet to the Lava Network Relayers.  They will submit the packet to the Ethereum Network if the reward is high enough.  </p>

                       <div class="form-group padding-md" v-if="lavaMetadata">
                           <div class="label">Relay Node URL</div>
                           <input class="w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" v-model="relayNodeURL" placeholder="xxx.xxx.xxx.xxx:yyyy">
                           <a v-bind:href="relayNodeURL"> Visit Relay Website </a>


                             <div class="whitespace-sm"></div>

                           <div id="btn-broadcast-lava-packet" v-if="lavaMetadata">
                             <div class="button inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded cursor-pointer" v-bind:click="actionBroadcastLavaPacket">Broadcast Lava Packet To Relay</div>
                           </div>

                           <div class="whitespace-sm"></div>

                           <div class="subtitle color-primary has-text-centered" v-cloak v-if="lavaMetadata && broadcastMessage" >
                             {{ broadcastMessage }}
                           </div>
                       </div>




                      <div class="whitespace-sm"></div>

                       <div class="form-group padding-md" v-if="lavaMetadata">
                           <div> Meta Packet </div> 
                          <textarea class="text-black" v-model="lavaMetadata"></textarea>
                       
                       </div>




                      <div class="whitespace-sm"></div>

                       <div class="button inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold m-2 py-2 px-4 rounded cursor-pointer" v-if="lavaMetadata" v-on:click="actionSubmitLava"> Submit Lava Tx </div>

                      <div class="loader inline-block" v-if="pendingTransaction">  </div>



                   </div>
              </div>
           </div>


          </div>

        </div>

</template>

<script>

import  PermitUtils from '../../js/eip712/permit-utils.js' 
import  EIP712HelperV3 from '../../js/eip712/EIP712HelperV3.js' 
import  EIP712SignPermit from '../../js/eip712/eip712-sign-permit.js'
import LavaPacketUtils from '../../js/eip712/lavapacket-utils.js'
 

const permissibleTokenABI = require('../../abi/PermissibleToken.json')
const lavaWalletABI = require('../../abi/LavaWallet.json')
 const ethUtil = require('ethereumjs-util')


export default {
  name: 'ActionContainer',
  props: ['shouldRender','selectedActionAsset', 'web3Plug'],
  components: { },
  data() {
    return {

        pendingTransaction: false,

        selectedActionType: 'permit' ,
        permitTokenQuantity:null,
        permitMetaData: null,


        transferTokenQuantity:null,
        transferTokenRecipient:null,
        transferTokenMethod:'transfer',
         transferTokenRelayReward:null,
         relayAuthorityType:['any relayers'],

        relayNodeURL:null,
        broadcastMessage: null, //msg back from relay 

        lavaMetadata: null 
    }
  },
  methods: {

      selectAction(name){
          this.selectedActionType = name
      },

      async actionPermitTokens(){
          console.log('permit!!', this.permitTokenQuantity, this.selectedActionAsset)

        let assetData = this.selectedActionAsset

        let allAccounts = await this.web3Plug.getConnectedAccounts() 
        let primaryAddress =  window.web3.utils.toChecksumAddress( allAccounts[0] ) 
 
        let contractData = this.web3Plug.getContractDataForActiveNetwork();
        let lavaContractAddress = contractData['LavaWallet'].address
       

        let permitInputData = {
 
          tokenAddress: assetData.address,
          permitFrom: primaryAddress,
          permitTo: lavaContractAddress,
          expires: 0,
          allowed: true,
        }

       let signResult = await PermitUtils.performOffchainSignForPermit( permitInputData,this.web3Plug )


       this.permitMetaData = JSON.stringify({

         from: signResult.from,
         to: signResult.to,
         tokenAddress: signResult.tokenAddress,
         nonce: signResult.nonce,
         expires: signResult.expires,
         allowed: signResult.allowed, 
         signature: signResult.signature
       }) 


      },


      async actionSubmitPermit(){

         let assetData = this.selectedActionAsset

        let allAccounts = await this.web3Plug.getConnectedAccounts() 
        let primaryAddress =  window.web3.utils.toChecksumAddress( allAccounts[0] ) 


        let contractData = this.web3Plug.getContractDataForActiveNetwork();
        
         let myTokenContract = this.web3Plug.getCustomContract(this.web3Plug.web3, permissibleTokenABI, assetData.address)

          let metadata = JSON.parse(this.permitMetaData)

        console.log('metadata' , metadata)
          let VRS = EIP712HelperV3.signatureToVRS(metadata.signature)


         let permitArgs = [
          metadata.from,
          metadata.to,
          metadata.nonce,
          metadata.expires,
          metadata.allowed,
          VRS.v,
          VRS.r,
          VRS.s          
          ]

          console.log('myTokenContract',myTokenContract)
          console.log('permissibleTokenABI',permissibleTokenABI)


         this.pendingTransaction = true

         let txResult = await myTokenContract.methods.permit(...permitArgs).send({from: primaryAddress}) 

         console.log('txResult', txResult)

         this.permitMetaData = null 
         this.pendingTransaction = false

      },

    
      async actionSignLavaPacket(){
          console.log('SignLavaPacket!!')



        let assetData = this.selectedActionAsset

        let allAccounts = await this.web3Plug.getConnectedAccounts() 
        let primaryAddress =  window.web3.utils.toChecksumAddress( allAccounts[0] ) 
 
        let contractData = this.web3Plug.getContractDataForActiveNetwork();
        let lavaContractAddress = contractData['LavaWallet'].address
       

        let lavaPacketInputData = {
          method:'transfer',
          relayAuthority: "0x0000000000000000000000000000000000000000", 
          from: primaryAddress,
          to: this.transferTokenRecipient,
          walletAddress: lavaContractAddress,
          tokenAddress: assetData.address,
          tokenAmount:  this.transferTokenQuantity,
          relayerReward:  0,
          expires: 0,
          nonce:  LavaPacketUtils.generateRandomNonce()
        }
 

           console.log('lavaPacketInputData',lavaPacketInputData)

        let signResult = await LavaPacketUtils.performOffchainSignForLavaPacket(lavaPacketInputData, this.web3Plug)
          console.log('signResult',signResult)


          this.lavaMetadata = JSON.stringify( 
              Object.assign( lavaPacketInputData , { signature: signResult.signature })
            )


      },

        async actionSubmitLava(){
            let assetData = this.selectedActionAsset

            let allAccounts = await this.web3Plug.getConnectedAccounts() 
            let primaryAddress =  window.web3.utils.toChecksumAddress( allAccounts[0] ) 


            let contractData = this.web3Plug.getContractDataForActiveNetwork();

            let lavaWalletAddress = contractData['LavaWallet'].address
            
            let lavaWalletContract = this.web3Plug.getCustomContract(this.web3Plug.web3, lavaWalletABI, lavaWalletAddress)

             let metadata = JSON.parse(this.lavaMetadata)

            console.log('metadata' , metadata)

              delete metadata['walletAddress']; 
 

            let lavaArgs = Object.values(  metadata  )

              console.log('lavaArgs' , lavaArgs)
 

            this.pendingTransaction = true

            let txResult = await lavaWalletContract.methods.transferTokensWithSignature(...lavaArgs).send({from: primaryAddress}) 

            console.log('txResult', txResult)

            this.permitMetaData = null 
            this.pendingTransaction = false

      },


      actionBroadcastLavaPacket(){

        console.log('broadcast lava packet ')
      }








  }
}
</script>