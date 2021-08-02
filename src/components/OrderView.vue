<template>
  <div id="order-view">
    <loading-modal :show="isLoading" />
    <h1 class="text-xl font-bold">Fahrzeug bestellen</h1>
    <button
      class="mt-1 mr-5 bg-red-400 text-white font-bold py-1 px-5 rounded-lg hover:bg-red-500"
      @click="close"
    >
      Schließen
    </button>
    <p>Felder ausfüllen</p>
    <button
      class="mt-1 mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
    >
      Bestellung absenden
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    close() {
      window.close();
    },
  },
};
</script>

<style>
</style>