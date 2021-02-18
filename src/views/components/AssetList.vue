<template>
     <div id="asset-list" class="asset-list bg-gray-400 px-8">
             
            <table class="table-auto w-full text-black">
              <thead>
                <tr class="  text-black font-bold border-b-2 border-black">
                  <td class="has-text-centered"> Icon </td>
                  <td class="has-text-centered"> Name </td>
                  <td class="has-text-centered"> Balance </td>

                </tr>
              </thead>
              <tbody >
              <tr    v-for="(item, index) in getTokenList()" v-bind:data-tokenaddress="item.address" 
                @click="clickedAsset(item)"
                class="hover:bg-gray-200 cursor-pointer select-none"
                >


                <td class="row-cell has-text-centered icon-url py-6"><img  v-bind:src="item.imgurl" height="42" width="42" ></img></td>
                <td class="row-cell has-text-centered token-name">{{item.name}}</td>
                  <td class="row-cell has-text-centered"><div class="has-text-centered token-balance">{{item.wallet_balance_formatted}}</div>  </td>
 
              </tr>
            </tbody>
            </table>

           </div>
</template>

<script>

const tokenData = require('../../config/token-data.json')

export default {
    name: 'AssetList',
    props:['networkName','onSelectedAssetCallback'],
  data() {
    return {
     
    }
  },
   mounted(){
      
    
  },

  methods: {
    getTokenList(){ 

      let localTokenData = tokenData.networks[this.networkName]

      let tokenList = Object.values(localTokenData)

       return tokenList

    },
    clickedAsset(asset){
      this.onSelectedAssetCallback(asset)
    }
  }
}
</script>