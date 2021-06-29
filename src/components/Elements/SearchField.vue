<template>
  <!-- <div class="grid grid-cols-11">
    <div class="col-span-2"> -->
  <input
    v-model="value"
    class="w-full placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
    placeholder="Schnellsuche (* als Platzhalter)"
  />
  <!-- </div>
  </div> -->
</template>

<script>
export default {
  props: {
    lazy: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      lazyTimer: null,
    };
  },
  watch: {
    value(val) {
      this.$emit("input", val);
      if (this.lazyTimer) clearTimeout(this.lazyTimer);
      let vm = this;
      this.lazyTimer = setTimeout(() => {
        if (vm.value) vm.$emit("change", vm.value ? vm.value : undefined);
        clearTimeout(vm.lazyTimer);
      }, 1200);
    },
  },
};
</script>

<style>
</style>