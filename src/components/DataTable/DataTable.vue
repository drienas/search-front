<template>
  <div id="datatable" :style="{ height: height }">
    <table class="border-collapse table-auto w-full border-b border-teal-400">
      <table-head
        v-if="columns.length > 0"
        :columns="columns"
        v-on:click="doSort"
      />
      <tbody v-if="columns.length > 0 && data.length > 0">
        <table-row
          v-bind:key="f.fzg_id"
          v-for="(f, i) in data"
          :index="i + 1"
          :columns="columns"
          :data="f"
          @openJR="openJR"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import TableRow from "./TableRow";
import TableHead from "./TableHead";

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: window.innerHeight,
    },
  },
  components: { TableRow, TableHead },
  methods: {
    doSort(name) {
      this.$emit("sort", name);
    },
    openJR(id) {
      this.$emit("openJR", id);
    },
  },
};
</script>

<style>
#datatable {
  overflow-y: scroll;
}

#datatable::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  cursor: pointer;
}
#datatable::-webkit-scrollbar-track {
  background-color: rgba(229, 231, 235, var(--bg-opacity));
  cursor: pointer;
}
#datatable::-webkit-scrollbar-thumb {
  cursor: pointer;
  background-color: #81e6d9;
}
</style>

<style scoped>
</style>
