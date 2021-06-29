<template>
  <tr
    :class="[
      'text-sm',
      'hover:bg-teal-300',
      'hover:cursor-pointer',
      { 'bg-gray-200': index % 2 === 0 },
      { 'bg-yellow-200': data['fzgReserviertInfo'] },
      { 'text-gray-500': data['fzgReserviertInfo'] },
    ]"
    v-on:dblclick="openJR(data['fzg_id'])"
  >
    <table-column v-bind:key="s.id" v-for="s in columns">{{
      data[s.name] ? data[s.name] : ""
    }}</table-column>
  </tr>
</template>

<script>
import TableColumn from "./TableColumn";

export default {
  components: { TableColumn },
  props: {
    columns: Array,
    data: Object,
    index: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    openJR(id) {
      this.$emit("openJR", id);
    },
  },
};
</script>

<style>
</style>
