<template>
  <div id="predefined-view">
    <loading-modal :show="isLoading" />
    <h1 class="text-3xl font-bold m-5" id="h1header">
      Fahrzeugsuche <small>v{{ version }}</small> <logindata />
    </h1>
    <div class="m-5 grid grid-cols-12" id="resHeader">
      <div class="col-span-2">
        <search-field id="searchfield" @change="fullText"></search-field>
      </div>
      <div class="ml-5 col-span-2">
        <button
          class="mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
          @click="getReserved"
        >
          Meine Reservierungen
        </button>
      </div>
      <div class="col-span-2">
        <button
          class="mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
          @click="getAllReserved"
        >
          Alle Reservierungen
        </button>
      </div>
    </div>
    <filter-view @change="filtered" />
    <p class="ml-5" v-if="hits !== null" id="hitlist">
      <small
        ><b>Die Suche ergab {{ hits }} Treffer (Zeige {{ shownHits }})</b>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trefferzahl anpassen:
        <button @click="paginate(50)">50</button> |
        <button @click="paginate(100)">100</button> |
        <button @click="paginate(200)">200</button> |
        <button @click="paginate(10000)">Alle</button>
      </small>
      <pdf :data="rawData" :columns="columns"></pdf>
    </p>
    <data-table
      id="datatable"
      :columns="columns"
      :data="data"
      :height="tableHeight"
      v-if="lazy"
      v-on:sort="sort"
      @openJR="openJR"
    ></data-table>
  </div>
</template>

<script>
import DataTable from "./DataTable/DataTable";
import FilterView from "./FilterView";
import columnsNW from "../models/columnsNW";
import columnsGW from "../models/columnsGW";

export default {
  components: { DataTable, FilterView },
  data() {
    return {
      columns: [],
      data: [],
      rawData: [],
      isLoading: false,
      lazy: false,
      tableHeight: window.innerHeight,
      fixedColumns: {
        nw: [],
        gw: [],
      },
      lastIndex: "cars_vk",
      lastQuery: {},
      pagination: 50,
      hits: null,
      version: null,
      isElevated: false,
    };
  },
  computed: {
    shownHits() {
      return this.hits <= this.pagination ? this.hits : this.pagination;
    },
  },
  methods: {
    getColumns() {
      return new Promise((resolve, reject) => {
        this.$columns(8)
          .then((columns) => {
            this.columns =
              columns.length > 0
                ? columns
                    .sort((a, b) => a.reihenfolge - b.reihenfolge)
                    .filter((x) => x.sichtbar)
                    .map((x) => ({ titel: x.titel, name: x.name }))
                : [];
            resolve();
          })
          .catch((err) => reject(err));
      });
    },
    fullText(query = "*") {
      this.lastIndex = "cars_vk";
      this.lastQuery = query;
      this.columns = this.fixedColumns.nw;
      this.isLoading = true;
      this.$http
        .post(`${this.$endpoints.esapi}/api/v3/cars_vk_full/full/`, {
          query,
          size: 5,
          sources: [
            "fzg_id",
            "fzgReserviertInfo",
            ...this.columns.map((x) => x.name),
          ],
        })
        .then((res) => {
          if (res.status !== 200) this.hits = 0;
          if (res.data && res.data.hitsTotal) this.hits = res.data.hitsTotal;
          let datatemp = res.data && res.data.hits ? res.data.hits : [];
          this.rawData = this.formatXLSXData(
            JSON.parse(JSON.stringify(datatemp))
          );
          this.data = this.formatData(datatemp);
        })
        .catch(() => {
          this.data = [];
        })
        .finally(() => (this.isLoading = false));
    },
    getReserved() {
      let user = "A999";
      if (window.$system && window.$system.username)
        user = window.$system.username;

      let query = JSON.parse(`{
                "pagination": {
                  "page": 1,
                  "perPage": 50
                },
                "order": "wwwpreis:desc",
                "filter": [
                  {
                    "and": [
                      {
                        "field": "fzgReserviertInfo",
                        "type": "wildcard",
                        "operator": "is",
                        "query": "${user}"
                      }
                    ]
                  }
                ]
              }`);

      let index = "cars_vk";
      let paginate = this.pagination;
      this.lastIndex = index;
      this.isLoading = true;
      this.columns = [
        ...this.fixedColumns.nw.slice(0, -3),
        {
          name: "ahid",
          titel: "Eigentümer",
        },
        {
          name: "resCommShort",
          titel: "Info",
        },
      ].filter((x) => !["Farbe", "Kraftstoff", "KM", "EZ"].includes(x.titel));
      if (paginate) {
        this.pagination = paginate;
        query.pagination.perPage = this.pagination;
      }
      this.lastQuery = query;
      this.$http
        .post(`${this.$endpoints.esapi}/api/v2/cars_vk_full/filter/`, query)
        .then((res) => {
          if (res.status !== 200) this.hits = 0;
          let datatemp = res.data && res.data.hits ? res.data.hits : [];
          if (res.data && res.data.hitsTotal) this.hits = res.data.hitsTotal;
          this.rawData = this.formatXLSXData(
            JSON.parse(JSON.stringify(datatemp))
          );
          this.data = this.formatData(datatemp);
        })
        .catch((err) => {
          console.log(err);
          this.data = [];
        })
        .finally(() => (this.isLoading = false));
    },
    getAllReserved() {
      let query = JSON.parse(`{
                "pagination": {
                  "page": 1,
                  "perPage": 10
                },
                "order": "fzgReserviertInfo:asc",
                "filter": [
                  {
                    "and": [
                      {
                        "field": "fzgReserviertInfo",
                        "type": "musts",
                        "operator": "exists"
                      }
                    ]
                  }
                ]
              }`);

      let index = "cars_vk_full";
      let paginate = 200;
      this.lastIndex = index;
      this.isLoading = true;
      this.columns = [
        {
          name: "fzgReserviertInfo",
          titel: "Reserviert",
        },
        ...this.fixedColumns.nw.slice(0, -3),
        {
          name: "ahid",
          titel: "Eigentümer",
        },
        {
          name: "resCommShort",
          titel: "Info",
        },
      ].filter((x) => !["Farbe", "Kraftstoff", "KM", "EZ"].includes(x.titel));
      if (paginate) {
        this.pagination = paginate;
        query.pagination.perPage = this.pagination;
      }
      this.lastQuery = query;
      this.$http
        .post(`${this.$endpoints.esapi}/api/v2/cars_vk_full/filter/`, query)
        .then((res) => {
          if (res.status !== 200) this.hits = 0;
          let datatemp = res.data && res.data.hits ? res.data.hits : [];
          if (res.data && res.data.hitsTotal) this.hits = res.data.hitsTotal;
          this.rawData = this.formatXLSXData(
            JSON.parse(JSON.stringify(datatemp))
          );
          let d = this.formatData(datatemp);
          this.data = d.sort(
            (a, b) =>
              a.fzgReserviertInfo.charCodeAt(0) -
              b.fzgReserviertInfo.charCodeAt(0)
          );
        })
        .catch((err) => {
          console.log(err);
          this.data = [];
        })
        .finally(() => (this.isLoading = false));
    },
    paginate(count) {
      this.filtered(this.lastQuery, this.lastIndex, count);
    },
    filtered(query, index = "cars_vk", paginate = this.pagination) {
      this.lastIndex = index;
      this.isLoading = true;
      if (paginate) {
        this.pagination = paginate;
        query.pagination.perPage = this.pagination;
      }
      this.lastQuery = query;
      this.columns =
        index === "cars_vk" ? this.fixedColumns.nw : this.fixedColumns.gw;

      if (index === "cars_vk_gw") index = "cars_vk_gw_tmp";
      this.$http
        .post(`${this.$endpoints.esapi}/api/v2/${index}/filter/`, query)
        .then((res) => {
          if (res.status !== 200) this.hits = 0;
          let datatemp = res.data && res.data.hits ? res.data.hits : [];
          if (res.data && res.data.hitsTotal) this.hits = res.data.hitsTotal;
          this.rawData = this.formatXLSXData(
            JSON.parse(JSON.stringify(datatemp))
          );
          this.data = this.formatData(datatemp);
        })
        .catch((err) => {
          console.log(err);
          this.data = [];
        })
        .finally(() => (this.isLoading = false));
    },
    formatXLSXData(data) {
      data.map((x) => {
        const fDatum = (datum) =>
          datum
            ? ((d) =>
                `${String(d.getUTCDate()).padStart(2, "0")}.${String(
                  d.getUTCMonth() + 1
                ).padStart(2, "0")}.${String(d.getUTCFullYear())}`)(
                new Date(datum)
              )
            : null;

        x.aktuelle_abh = fDatum(x.aktuelle_abh);
        x.rechnungsDatum = fDatum(x.rechnungsDatum);
        x.erstzulassung_fzgtool = fDatum(x.erstzulassung_fzgtool);
        x.erstzulassung = fDatum(x.erstzulassung);
        x.res_until = null;

        x.resCommShort = null;
        if (x.reserviertComment) x.resCommShort = x.reserviertComment;

        if (x.fzgReserviertInfo) {
          x.res_until = ((r) => (r ? fDatum(r) : null))(
            x.fzgReserviertInfo.split(/;/g).map((x) => x.trim())[3]
          );
          x.fzgReserviertInfo = x.fzgReserviertInfo
            .split(/;/g)
            .map((x) => x.trim())[1];
        }
      });
      return data;
    },
    formatData(data) {
      data.map((x) => {
        const fPreis = (d) =>
          d ? `${d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}€` : null;
        const fVersion = (m, v) =>
          m && v
            ? v.replace(new RegExp(`${m.replace("neu", "").trim()}`, "gi"), "")
            : v;
        const fEz = (ez) =>
          ez
            ? ((d) =>
                `${String(d.getUTCMonth() + 1).padStart(
                  2,
                  "0"
                )}/${d.getUTCFullYear()}`)(new Date(ez))
            : null;
        const fDatum = (datum) =>
          datum
            ? ((d) =>
                `${String(d.getUTCDate()).padStart(2, "0")}.${String(
                  d.getUTCMonth() + 1
                ).padStart(2, "0")}.${String(d.getUTCFullYear()).slice(-2)}`)(
                new Date(datum)
              )
            : null;

        x.resCommShort = null;
        if (x.reserviertComment)
          x.resCommShort =
            x.reserviertComment.length > 14
              ? `${x.reserviertComment.slice(0, 11)}...`
              : x.reserviertComment;
        x.aktuelle_abh = fDatum(x.aktuelle_abh);
        x.rechnungsDatum = fDatum(x.rechnungsDatum);
        x.wwwpreis = fPreis(x.wwwpreis);
        x.listenpreis_upe_brutto = fPreis(x.listenpreis_upe_brutto);
        x.model_text =
          this.lastIndex === "cars_vk" || this.lastIndex === "cars_vk_full"
            ? fVersion(x.modell_dispo, x.model_text)
            : x.model_text;
        if (this.lastIndex === "cars_vk" || this.lastIndex === "cars_vk_full")
          x.gebrauchtyp = x.gebrauchtyp
            ? x.gebrauchtyp
                .replace("Vorführwagen", "VFW")
                .replace("Neuwagen", "NW")
                .replace("Gebrauchtwagen", "GW")
                .replace("Werkstattwagen", "WW")
            : null;
        else
          x.gebrauchtyp_fzgtool = x.gebrauchtyp_fzgtool
            ? x.gebrauchtyp_fzgtool
                .replace("Vorführwagen", "VFW")
                .replace("Neuwagen", "NW")
                .replace("Gebrauchtwagen", "GW")
                .replace("Werkstattwagen", "WW")
            : null;
        x.erstzulassung_fzgtool = fEz(x.erstzulassung_fzgtool);
        x.erstzulassung = fEz(x.erstzulassung);
        if (!x.bestellnummer && x.ordernummer) x.bestellnummer = x.ordernummer;
        if (!x.bestellnummer && !x.ordernummer && x.bestellnr)
          x.bestellnummer = x.bestellnr;
        if (x.standort) {
          let so = x.standort.split(/-/g).map((x) => x.trim());
          x.standort = `${so[1] ? so[1] : ""}${so[2] ? "-" + so[2] : ""}`;
        }
        if (
          x.optionscodes &&
          x.hersteller_dispo &&
          (x.hersteller_dispo === "Jaguar" ||
            x.hersteller_dispo === "Land Rover")
        ) {
          let oc = x.optionscodes.split(/,/g);
          if (oc.length > 1)
            oc = oc
              .map((x) => {
                let data = x.split(/\s/g);
                data = data[data.length - 1];
                return data.trim();
              })
              .filter((x) => !!x)
              .filter((x) => /\d/.test(x))
              .filter((x) => /^\w{3,5}$/.test(x))
              .join(" ");
          else oc = x.optionscodes;
          x.optionscodes = oc ? oc : null;
        }
        if (this.lastIndex === "cars_vk_full" && x.fzgReserviertInfo)
          x.fzgReserviertInfo = x.fzgReserviertInfo
            .split(/;/g)
            .map((x) => x.trim())[1];
      });
      return data;
    },
    async sort(attr) {
      if (this.lastIndex === "cars_vk_full" && attr === "fzgReserviertInfo") {
        this.data = this.data.reverse();
        return;
      }
      switch (attr) {
        case "resCommShort":
          attr = "reserviertComment";
          break;
        default:
          break;
      }
      let lq = this.lastQuery;
      if (!this.lastQuery.order) return;
      let ls = lq.order.split(":");
      let ns = [];
      if (ls[0] === attr) {
        ns.push(attr);
        ns.push(ls[1] === "desc" ? "asc" : "desc");
      } else {
        ns.push(attr);
        ns.push("desc");
      }
      lq.order = ns.join(":");
      let tempCols = this.columns;
      await this.filtered(lq, this.lastIndex);
      this.columns = tempCols;
    },
    openJR(id) {
      let type = this.lastIndex === "cars_vk" ? "NW" : "GW";
      if (!this.$isElectron)
        this.$router.push({ name: "details", params: { id, type } });
      else this.$openPopup(`details/${type}/${id}`);
    },
  },
  async beforeMount() {
    await this.getColumns();
    this.fixedColumns.nw = columnsNW;
    this.fixedColumns.gw = columnsGW;
    this.columns = this.fixedColumns.nw;
  },
  mounted() {
    this.$nextTick(() => {
      this.version = this.$version;
      window.document.title = `Fahrzeugsuche - Schneider Gruppe`;
      this.lazy = true;
      let user = window.$system ? window.$system.username || "A999" : "A999";
      this.isElevated = this.$elevatedUsers.includes(user);

      let customElementsToCalculateHeight = [
        "resHeader",
        "navheader",
        "filterview",
        "h1header",
        "hitlist",
      ];
      customElementsToCalculateHeight = customElementsToCalculateHeight.filter(
        (x) => document.getElementById(x)
      );
      this.tableHeight =
        [window.innerHeight, ...customElementsToCalculateHeight].reduce(
          (a, b) => a - this.$rheight(window, b)
        ) -
        5 +
        "px";
    });
    window.document.getElementById("main").classList.add("overflow-y-hidden");
  },
};
</script>
<style>
</style>
