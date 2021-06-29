<template>
  <div id="app">
    <!-- <div class="flex flex-col flex-nowrap max-h-screen max-w-screen h-screen w-screen overflow-hidden"> -->
    <div
      id="main"
      class="flex flex-col flex-nowrap max-h-screen max-w-screen h-screen w-screen overflow-x-hidden"
    >
      <navbar></navbar>
      <div id="fwbody" class="flex-1 relative">
        <router-view v-if="display.pdv"></router-view>
        <!-- <predefined-view v-if="display.pdv" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  components: { Navbar },
  data() {
    return {
      display: {
        pdv: false,
      },
    };
  },
  mounted() {
    this.display.pdv = true;
  },
};
</script>

<style>
</style>
