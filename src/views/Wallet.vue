<template>


<div class=" container mx-auto bg-gray-800 " id="wallet">

  <Navbar /> 



      <div id="jumbotron" class=" ">



        <div class="whitespace-sm"></div>


        <div class="subtitle color-primary has-text-centered" v-cloak>
          {{ errorMessage }}
        </div>

      </div>

      <section class="hero   ">
        <div class="hero-body">

          <ActionContainer
            v-bind:shouldRender="true"
            v-bind:selectedActionAsset="selectedActionAsset"

           />


        <div class="whitespace-md"></div>

		
          <div id="asset-list" class="asset-list bg-gray-400">
            	Asset List 
            <table>
              <thead>
                <tr >
                  <td class="has-text-centered"> Icon </td>
                  <td class="has-text-centered"> Name </td>
                  <td class="has-text-centered"> Approved Balance </td>
                  <td class="has-text-centered"> External Amount </td>

                </tr>
              </thead>
              <tbody>
              <tr    v-for="(item, index) in token_list" v-bind:data-tokenaddress="item.address" v-bind:class="{   'asset-row':true, 'acts-as-link':true, 'hover-shadow':true   } " >
                <td class="row-cell has-text-centered icon-url"><img  v-bind:src="item.imgurl" height="42" width="42" ></img></td>
                <td class="row-cell has-text-centered token-name">{{item.name}}</td>
                <td class="row-cell has-text-centered"><div class=" token-balance">{{item.approved_balance_formatted}}</div> </td>
                <td class="row-cell has-text-centered"><div class="has-text-centered token-balance">{{item.wallet_balance_formatted}}</div>  </td>

              </tr>
            </tbody>
            </table>

           </div>


                 <div class="whitespace-md"></div>


             <div id="lava-packet-dropzone " class="lava-packet-dropzone bg-red-200">

               <div class="subtitle is-size-3">Drop Lava Packets Here</div>

               <div class="dropzone"  >
                  <div class="hand-icon-holder">

                  </div>

                  <div class="dropzone-file-input-container">
                    <p> Or select a local file </p>

                      <div class="light-box">
                        <input class="dropzone-file-input" name="lavaPacketFile" type="file">
                      </div>
                  </div>

               </div>




             </div>

        </div>
      </section>


  <Footer /> 

  </div>




 </template>

<script >

const tokenData = require('../config/token-data.json')

import Web3Plug from '../js/web3Plug.js'

import ActionContainer from './components/ActionContainer.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'Wallet',
  components: {Navbar, Footer,ActionContainer},
  data() {
    return {
		selectedActionAsset: null,
		token_list:  [], 
		errorMessage:null,
    web3Plug: null

    }
  },
  created(){


     this.web3Plug = new Web3Plug()

    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
          console.log('stateChanged',connectionState);

          // CUSTOM CODE HERE
          this.activeAccountAddress = connectionState.activeAccountAddress
          this.activeNetworkId = connectionState.activeNetworkId
          // END CUSTOM CODE

        }.bind(this));

    this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
          console.error('error',errormessage);

          //CUSTOM CODE HERE
          this.web3error = errormessage
          // END CUSTOM CODE
        }.bind(this));


    this.web3Plug.connectWeb3( )


    let networkName = this.web3Plug.getWeb3NetworkName(this.activeNetworkId)
    console.log('net name', networkName )

    let localTokenData = tokenData.networks[networkName]

	  this.token_list = Object.values(localTokenData)
  },
  methods: {

  }
}
</script>
