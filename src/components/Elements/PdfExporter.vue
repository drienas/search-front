<template>
  <span class="ml-5" id="pdfexporter"
    ><b>Excel</b>
    <button title="Excel-Export" @click="createPdf">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 pt-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        />
      </svg>
    </button>
  </span>
</template>

<script>
import columnsNW from "../../models/columnsNW";

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    columns: {
      type: Array,
      default() {
        return columnsNW;
      },
    },
  },
  data() {
    return {
      pdfExportUrl: null,
      type: "xlsx",
      defaultKeep: [],
    };
  },
  methods: {
    createPdf() {
      let cols = {};
      this.columns.map((x) => (cols[x.name] = x.titel));
      this.defaultKeep = [...this.columns.map((x) => x.name)];
      if (Object.values(cols).includes("Reserviert")) {
        cols["res_until"] = "Reserviert bis";
        this.defaultKeep = [...this.defaultKeep, "res_until"];
      } else {
        cols["fzgReserviertInfo"] = "Reserviert";
        cols["res_until"] = "Reserviert bis";
        cols["resCommShort"] = "Reserviert Info";
        this.defaultKeep = [
          ...this.defaultKeep,
          "fzgReserviertInfo",
          "res_until",
          "resCommShort",
        ];
      }

      this.$http
        .post(`${this.pdfExportUrl}/${this.type}`, {
          rows: this.data,
          cols,
          keep: this.defaultKeep,
          title: `Fahrzeugsuche-Export`,
        })
        .then((res) => {
          if (res.status !== 200) {
            console.error(`Fehler beim Excel-Export`);
            return;
          }
          res = res.data;
          if (!res.success) {
            console.error(`Fehler beim Excel-Export`);
            return;
          }
          let uri = res.uri;
          let a = document.createElement("a");
          a.href = uri;
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
        });
    },
  },
  beforeMount() {
    this.pdfExportUrl = this.$endpoints.pdf;
  },
};
</script>

<style>
</style>

