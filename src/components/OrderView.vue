<template>
  <div id="order-view" class="m-5">
    <loading-modal :show="isLoading" />
    <h1 class="text-xl font-bold">{{ carData.carDescription }} bestellen</h1>
    <button
      class="mt-1 mr-5 bg-red-400 text-white font-bold py-1 px-5 rounded-lg hover:bg-red-500"
      @click="close"
    >
      Schließen
    </button>
    <p class="m-5">
      Mit dem Klick auf "Bestellung absenden" lösen Sie eine verbindliche
      Bestellung<br />
      des Fahrzeuges in der Neuwagendisposition in Chemnitz aus!
    </p>
    <div class="m-5">
      <input
        type="checkbox"
        v-model="orderData.orderTransport"
        name="orderTransport"
      />
      <label for="orderTransport" class="mr-2">
        Transport durch DSG
        <small>(PKW - 55€ netto / Master&Trafic 100€ netto)</small></label
      >
    </div>
    <div class="m-5">
      <input
        type="radio"
        id="kunde"
        name="kl"
        value="kunde"
        v-model="orderData.orderType"
      />
      <label for="nw" class="text-lg mr-5"> Kundenfahrzeug</label>
      <input
        type="radio"
        id="lager"
        name="kl"
        value="lager"
        v-model="orderData.orderType"
      />
      <label for="gw" class="text-lg mr-5"> Lagerfahrzeug</label>
    </div>
    <div class="m-5" v-if="orderData.orderType === 'kunde'">
      <label for="customerName" class="text-lg mr-5"> Kundenname</label>
      <input
        id="customerName"
        v-model="orderData.customerName"
        placeholder="Kundenname"
        class="placeholder-gray-500 border border-gray-500 text-teal-400 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
      />
    </div>
    <button
      class="mt-1 mr-5 bg-teal-400 text-white font-bold py-1 px-5 rounded-lg"
      :class="[{ 'hover:bg-teal-500': canOrder }, { 'bg-teal-600': !canOrder }]"
      :disabled="!canOrder"
      @click="order"
    >
      Bestellung absenden
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      carData: {},
      orderData: {
        orderTransport: false,
        orderType: null,
        customerName: null,
      },
      isLoading: false,
    };
  },
  computed: {
    canOrder() {
      return (
        this.orderData.orderType &&
        (this.orderData.orderType === "lager" || this.orderData.customerName)
      );
    },
    userData() {
      return this.$store.state.userdata;
    },
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
    order() {
      this.isLoading = true;
      let data = {
        ...this.orderData,
        fullName: this.userData.fullName,
        id: this.id,
        vin: this.carData.vin,
      };
      this.$http
        .post(`${this.$endpoints["esapi"]}/seax/order`, {
          ...data,
        })
        .then((res) => {
          if (res.status === 200) {
            alert(`Bestellung versendet!`);
            window.close();
          } else
            throw `Fehler beim Bestellen, bitte versuchen Sie es noch einmal!`;
        })
        .catch((error) => {
          alert(`Fehler! - ${error}`);
        });
      this.isLoading = false;
    },
  },
  mounted() {
    this.isLoading = true;
    this.id = this.$route.params.id;
    let carData = this.$store.state.carcache.find((x) => x.id === this.id);
    if (carData) this.carData = carData;
    this.isLoading = false;
  },
};
</script>

<style>
</style>