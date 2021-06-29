<template functional>
    <div id="loading" class="z-50 fixed top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-50" v-show="props.show">
    <div class="flex justify-center items-center h-full">
      <div>
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-white-200 h-16 w-16"></div>
        <div class="text-white mt-2 text-center">Lade...</div>
      </div>
    </div>
   </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  #loading {
    backdrop-filter: blur(1px);
  }
  .loader {
    border-top-color: #b2f5ea;
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
  }

  @-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>