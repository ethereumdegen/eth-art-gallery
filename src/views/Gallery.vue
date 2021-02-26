<template>
<div class="overlay" style="width:100%;height:100%;border: 0">
<iframe v-if="contentType=='web'" v-bind:src="contentURL" style="border: 0; width: 100%; height: 100%">Your browser doesn't support iFrames.</iframe>
<img v-if="contentType=='image'"  v-bind:src="contentURL" style="width:100%;height:100%;border: 0;object-fit: contain ; margin:0 auto;" ></img>

</div>
 </template>

<script >
  
var updateGalleryInterval;

const config = require('../../config.json')

export default {
  name: 'Gallery',
  components: { },
  data() {
    return {
      contentURL: null,
      contentURLArray: [],
      contentIndex: 0,
      contentType: 'web'
    }
  },
  mounted(){

      this.contentURLArray =  config.contentURLs;

      updateGalleryInterval = setInterval(this.updateGallery.bind(this), config.delay  )
      this.updateGallery() 
  },
  beforeDestroy(){
    clearInterval( updateGalleryInterval )
  },
  methods: {
    updateGallery(){
      console.log('update gallery')
      this.contentURL = this.contentURLArray[this.contentIndex].src;
      this.contentType = this.contentURLArray[this.contentIndex].type;

      this.contentIndex++
      if(this.contentIndex >= this.contentURLArray.length ){
        this.contentIndex = 0
      }
    }

  }
}
</script>
