<template>
  <thead>
    <tr>
      <th
        class="border-l border-r border-teal-400 sticky top-0 px-4 py-2 text-sm text-gray-800 bg-gray-300 hover:cursor-pointer"
        v-bind:key="s.id"
        v-for="s in columns"
        v-on:click="doSort(s.name)"
      >
        {{ s.titel }}
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    doSort(name) {
      this.$emit("click", name);
    },
  },
};
</script>

<style>
</style>