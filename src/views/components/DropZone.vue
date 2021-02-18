<template>
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
</template>

<script>
export default {
    name: 'DropZone',
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>