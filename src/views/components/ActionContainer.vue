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
                      <input type="text" class="  h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline " v-model="permitTokenQuantity" placeholder="token amount">
                      <div class="button inline-block bg-green-500 hover:bg-green-700 text-white font-bold m-2 py-2 px-4 rounded cursor-pointer" v-on:click="actionPermitTokens"> Permit </div>
           
                  </div>
                </div>
                <div class="  flex-grow">
                     <div class="is-size-6"> Balance: {{ selectedActionAsset.wallet_balance_formatted }} </div>
                    <div class="is-size-6"> Quantity Approved: {{ selectedActionAsset.approved_balance_formatted }} </div>
                         </div>
              </div>
            </div>



          </div>


          <div class="lava-transfer-container  m-4 p-4" v-if="(selectedActionType=='lavatransfer')" v-cloak>

            <div class="subtitle-banner has-background-orange has-text-light"> Approved Balance: {{ selectedActionAsset.approved_balance_formatted }} </div>

            <div class="input-container padding-md">
            <div class="label">Transfer Tokens</div>

              <p> Generate a signed Lava Transfer Message.  This message can be submitted to the Ethereum network by anyone, at which point the tokens will be transferred to the recipient's account.  </p>


              <div class="whitespace-sm"></div>


                <div class="flex flex-row ">
                    <div class="flex-grow">



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
                            <select class=" " onchange=" " v-model="relayKingRequired" placeholder="">
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
                        <div class="button is-primary btn-action-lava-transfer" v-on:click="actionLavaTransfer"> Sign </div>

                     </div>
                   <div class="flex-grow">
                       <div class="is-size-6">   </div>

                       <p v-if="lavaPacketExists"> Specify the URL for a Lava Network Node and broadcast this packet to the Lava Network Relayers.  They will submit the packet to the Ethereum Network if the reward is high enough.  </p>

                       <div class="form-group padding-md" v-if="lavaPacketExists">
                           <div class="label">Relay Node URL</div>
                           <input class="input input-short is-primary" v-model="relayNodeURL" placeholder="xxx.xxx.xxx.xxx:yyyy">
                           <a v-bind:href="relayNodeURL"> Visit Relay Website </a>


                             <div class="whitespace-sm"></div>

                           <div id="btn-broadcast-lava-packet" v-if="lavaPacketExists">
                             <div class="button is-primary btn-broadcast-lava-packet">Broadcast Lava Packet</div>
                           </div>

                           <div class="whitespace-sm"></div>

                           <div class="subtitle color-primary has-text-centered" v-cloak v-if="lavaPacketExists" >
                             {{ broadcastMessage }}
                           </div>
                       </div>




                      <div class="whitespace-sm"></div>

                       <div class="form-group padding-md" v-if="lavaPacketExists">
                           <div class="label">Lava Packet Data</div>
                           <textarea class="textarea" placeholder="Lava packet data" rows="10"  v-model="lavaPacketData" ></textarea>

                       </div>




                               <div class="whitespace-sm"></div>

                               <div id="btn-download-lava-packet" v-if="lavaPacketExists">
                               </div>
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
 

const permissibleTokenABI = require('../../abi/PermissibleToken.json')
 const ethUtil = require('ethereumjs-util')


export default {
  name: 'ActionContainer',
  props: ['shouldRender','selectedActionAsset', 'web3Plug'],
  components: { },
  data() {
    return {

       

        selectedActionType: 'permit' ,
        permitTokenQuantity:null,


        transferTokenQuantity:null,
        transferTokenRecipient:null,
        transferTokenMethod:'transfer',
         transferTokenRelayReward:null,
         relayKingRequired:['any relayers'],


        lavaPacketExists: false 
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

        console.log('addr', primaryAddress)

         //let contractData = this.web3Plug.getContractDataForActiveNetwork()

        let myTokenContract = this.web3Plug.getCustomContract(window.web3, permissibleTokenABI,  assetData.address)
 

    /*

 // EIP712 niceties
    bytes32 public DOMAIN_SEPARATOR;
    // bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address holder,address spender,uint256 nonce,uint256 expiry,bool allowed)");
    bytes32 public constant PERMIT_TYPEHASH = 0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb;


     require(_chainId != 0);
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(_name)),
                keccak256(bytes(version)),
                _chainId,
                address(this)
            )
        );*/

        /*
       bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, _holder, _spender, _nonce, _expiry, _allowed))
            )
        );

        */

       let currentPermitNonce = 0 

       let inputDataArray = [primaryAddress,primaryAddress, 1,0,true]

       const typedData = PermitUtils.getPermitTypedDataFromParams(
            'TEST',
            0x2a,  //0x2a 
            window.web3.utils.toChecksumAddress(assetData.address),  //IMPORTANT 

            ...inputDataArray  //unpack the array 
       )
        console.log('permit typedData',typedData)
 
       var stringifiedData = JSON.stringify(  typedData );

 



        let signature = await  EIP712HelperV3.signTypedData( window.web3, primaryAddress, stringifiedData  )
        console.log( signature )  
            

        let signHash = EIP712SignPermit.signHash(typedData)

            
        //let actualDomainSeparator = 0x2c8b239014107b10523ebb8bfbdf54768e1d0c91dc7cb9e32528db4340122ebf
 

        console.log('domainseparator',ethUtil.bufferToHex(EIP712SignPermit.structHash('EIP712Domain', typedData.domain)))
         console.log('hash2',ethUtil.bufferToHex(EIP712SignPermit.structHash(typedData.primaryType, typedData.message)))


        //hash2 must be bad 

     
        console.log('meep signhash ', signHash)
        
        
        //bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address holder,address spender,uint256 nonce,uint256 expiry,bool allowed)");
        
        let permitTypehash = window.web3.utils.soliditySha3( "Permit(address holder,address spender,uint256 nonce,uint256 expiry,bool allowed)" )

             console.log('meep permitTypehash ', permitTypehash) //this is correct 


             let HashTwo = window.web3.utils.soliditySha3( permitTypehash, ...inputDataArray     )
            console.log('hashTwo', HashTwo)
    /*   

         let digest = web3.sha3( "\x19\x01" + DOMAIN_SEPARATOR + web3.sha3(PERMIT_TYPEHASH, ...inputDataArray   ) )

         console.log(digest)*/


           window.web3.eth.personal.ecRecover(stringifiedData,signature, function(error, result){
                    if(!error)
                        console.log('ecrecover', result)
                    else
                        console.error(error);
                }) 

        //require(_holder == ecrecover(digest, _v, _r, _s));

                


      },

      actionLavaTransfer(){
          console.log('actionLavaTransfer!!')
      }
  }
}
</script>