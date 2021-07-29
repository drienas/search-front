<template>
  <span id="loginData" class="text-base ml-10">
    [{{ userData.username }}]
    <button
      @click="logout"
      class="ml-5 bg-teal-400 hover:bg-teal-500 text-white font-bold px-2 rounded-lg"
      type="submit"
    >
      Ausloggen
    </button></span
  >
</template>

<script>
export default {
  computed: {
    userData() {
      return this.$store.state.userdata;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$store.dispatch("updateToken");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style>
</style>