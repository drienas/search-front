<template>
  <div id="filterview">
    <!-- <pre><small>{{filter.getriebe}}</small></pre> -->
    <form v-on:submit.prevent="formatQuery">
      <div class="grid grid-cols-4 m-5 mb-2">
        <div class="col-span-2">
          <div class="grid grid-cols-2 mb-2">
            <div>
              <fieldset>
                <input
                  type="radio"
                  id="nw"
                  name="nwgw"
                  value="Neuwagen"
                  v-model="filter.type"
                />
                <label for="nw" class="text-lg mr-5"> Neuwagen</label>
                <input
                  type="radio"
                  id="gw"
                  name="nwgw"
                  value="Gebrauchtwagen"
                  v-model="filter.type"
                />
                <label for="gw" class="text-lg mr-5"> Gebrauchtwagen</label>
              </fieldset>
            </div>
            <div>
              <fieldset v-if="filter.type === 'Neuwagen'">
                <input
                  type="checkbox"
                  id="bestand"
                  name="auflager"
                  value="Bestand"
                  v-model="filter.aufLager"
                />
                <label for="bestand" class="text-lg mr-5"> Bestand</label>
                <input
                  type="checkbox"
                  id="vorlauf"
                  name="auflager"
                  value="Vorlauf"
                  v-model="filter.aufLager"
                />
                <label for="vorlauf" class="text-lg mr-5"> Vorlauf</label>
              </fieldset>
            </div>
          </div>
          <div class="grid grid-cols-2 mb-2">
            <div>
              <fieldset>
                <label for="hersteller" class="text-lg mr-5">Hersteller</label>
                <select
                  v-model="filter.hersteller"
                  class="mr-3 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                >
                  <option>Alle</option>
                  <option>Renault</option>
                  <option>Seat</option>
                  <option>Jaguar</option>
                  <option>Land Rover</option>
                  <option>Dacia</option>
                  <option>CUPRA</option>
                  <option>Sonstige</option>
                </select>
                <input
                  type="text"
                  placeholder="Sonstige"
                  v-model="filter.vhersteller"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
              </fieldset>
            </div>
            <div>
              <fieldset>
                <label for="standort" class="text-lg mr-5">Standort</label>
                <select
                  v-model="filter.standort"
                  class="mr-3 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                >
                  <option>Alle</option>
                  <option v-for="standort in standorte" v-bind:key="standort">
                    {{ standort }}
                  </option>
                </select>
              </fieldset>
            </div>
          </div>
          <div class="grid grid-cols-2 mb-2">
            <div>
              <fieldset>
                <label for="modell" class="text-lg mr-5">Modell </label>
                <input
                  type="text"
                  placeholder="Modell"
                  v-model="filter.modell"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
              </fieldset>
            </div>
            <div>
              <fieldset>
                <label for="version" class="text-lg mr-5">Version </label>
                <input
                  type="text"
                  placeholder="Version"
                  v-model="filter.version"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
              </fieldset>
            </div>
          </div>
          <div class="grid grid-cols-2 mb-2">
            <div>
              <fieldset v-if="filter.type === 'Neuwagen'">
                <label for="optionen" class="text-lg mr-5">Optionen </label>
                <input
                  type="text"
                  placeholder="(mit Komma trennen)"
                  v-model="filter.optionen"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
              </fieldset>
            </div>
            <div>
              <fieldset>
                <label for="preis" class="text-lg mr-5">Preis </label>
                <input
                  type="text"
                  placeholder="von"
                  v-model="filter.preis.from"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
                -
                <input
                  type="text"
                  placeholder="bis"
                  v-model="filter.preis.to"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
              </fieldset>
            </div>
          </div>
          <div class="grid grid-cols-2 mb-2">
            <div class="col-span-2">
              <fieldset>
                <label for="erstzulassung" class="text-lg mr-5"
                  >Erstzulassung
                </label>
                <input
                  type="month"
                  placeholder="von"
                  v-model="filter.erstzulassung.from"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
                -
                <input
                  type="month"
                  placeholder="bis"
                  v-model="filter.erstzulassung.to"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
                &nbsp;<span
                  @click.prevent="
                    filter.erstzulassung = { from: null, to: null }
                  "
                  class="rounded-full hover:cursor-pointer border hover:bg-red-200 text-red-500 border-red-500 pt-1 pb-1 pl-3 pr-3 text-sm"
                >
                  X
                </span>
              </fieldset>
            </div>
            <div></div>
          </div>
          <div class="grid grid-cols-6">
            <div class="col-span-1">
              <div
                class="hover:cursor-pointer mr-5 bg-gray-400 hover:bg-gray-500 text-white font-bold py-0 px-3 rounded-lg"
                v-on:click.stop.prevent="advancedFilters = !advancedFilters"
              >
                Mehr Filter
              </div>
            </div>
            <div></div>
          </div>
          <div class="grid grid-cols-2 mt-3" v-show="advancedFilters">
            <div class="col-span-2">
              <p>
                <br />
                <small class="text-red-600"
                  >Die folgende Ausstattungssuche ist experimentell und nur für
                  bereits gepflegte Fahrzeuge.</small
                >
              </p>
              <div class="grid grid-cols-5">
                <div v-for="(k, v) in filter.asettings" v-bind:key="v">
                  <input
                    type="checkbox"
                    :id="v"
                    :name="v"
                    :value="v"
                    v-model="filter.ssettings"
                  />
                  <label for="v" class="text-sm mr-2 capitalize">
                    {{ v }}</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 mb-0">
            <fieldset class="float-left">
              <button
                type="submit"
                @click="formatQuery"
                class="mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
              >
                Suchen
              </button>
              <button
                @click="cleanAttributes"
                class="mr-5 bg-red-300 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
              >
                Löschen
              </button>
            </fieldset>
            <button
              class="float-right mr-5 bg-green-300 hover:bg-green-500 text-white font-bold py-1 px-5 rounded-lg"
              @click.prevent="legende = !legende"
            >
              Standort-Legende
            </button>
            <div id="legende" v-show="legende">
              <b>Unsere Standorte:</b><br />
              <a
                href="https://www.dieschneidergruppe.de/chemnitz"
                target="_blank"
                >Zentrallagerplatz<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/sportcenter-roehrsdorf"
                target="_blank"
                >02 - Röhrsdorf<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/burgstaedt"
                target="_blank"
                >03 - Burgstädt<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/frankenberg"
                target="_blank"
                >04 - Frankenberg<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/oederan"
                target="_blank"
                >05 - Oederan<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/standorte/business-center-mittweida"
                target="_blank"
                >06 - Mittweida<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/chemnitz"
                target="_blank"
                >07 - Chemnitz<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/business-center-chemnitz"
                target="_blank"
                >08 - Chemnitz Business-Center<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/zwickau"
                target="_blank"
                >09 - Zwickau<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/business-center-hof"
                target="_blank"
                >10 - Hof Business-Center<br
              /></a>
              <a href="https://www.dieschneidergruppe.de/plauen" target="_blank"
                >11 - Plauen<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/land-rover-hof"
                target="_blank"
                >12 - Hof BOR<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/zwickau"
                target="_blank"
                >13 - Zwickau Business-Center<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/zwickau"
                target="_blank"
                >13 - Zwickau Lager<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/freiberg"
                target="_blank"
                >14 - Freiberg<br
              /></a>
              <a
                href="https://www.dieschneidergruppe.de/plauen-seat"
                target="_blank"
                >15 - Plauen SEAT</a
              >
            </div>
          </div>
          <div class="col-span-2 mt-2" v-if="filter.ssettings.length > 0">
            <p class="text-sm text-gray-500">
              Ausgewählte Ausstattung:
              {{
                filter.ssettings
                  .map((x) => x[0].toUpperCase() + x.substring(1))
                  .join(" | ")
              }}
            </p>
          </div>
        </div>
        <div class="col-span-2">
          <div class="grid grid-cols-2 mb-2 mt-2">
            <div>
              <fieldset>
                <br />
                <label for="farbe" class="text-lg mr-5">Farbe </label>
                <input
                  type="text"
                  placeholder="Farbe"
                  v-model="filter.farbe"
                  class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                />
              </fieldset>
            </div>
            <div>
              <div>
                <br />
                <fieldset>
                  <label for="kw" class="text-lg mr-5">KW </label>
                  <input
                    type="text"
                    placeholder="von"
                    v-model="filter.kw.from"
                    class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                  />
                  -
                  <input
                    type="text"
                    placeholder="bis"
                    v-model="filter.kw.to"
                    class="placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                  />
                </fieldset>
              </div>
            </div>
            <div class="mt-3">
              <div>
                <fieldset>
                  <label for="Eigentümer" class="text-lg mr-5"
                    >Eigentümer</label
                  >
                  <select
                    v-model="filter.ahid"
                    class="mr-3 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                  >
                    <option
                      v-for="ahid in eigentuemer"
                      v-bind:key="ahid.value"
                      :value="ahid.value"
                    >
                      {{ ahid.key }}
                    </option>
                  </select>
                </fieldset>
              </div>
            </div>
            <div class="mt-3">
              <fieldset>
                <label for="Kraftstoff" class="text-lg mr-5">Kraftstoff</label>
                <select
                  v-model="filter.kraftstoff"
                  class="mr-3 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                >
                  <option>Alle</option>
                  <option
                    v-for="kraftstoff in kraftstoffe"
                    v-bind:key="kraftstoff"
                  >
                    {{ kraftstoff }}
                  </option>
                </select>
              </fieldset>
            </div>
            <div class="mt-3">
              <fieldset>
                <label for="Getriebe" class="text-lg mr-5">Getriebe</label>
                <select
                  v-model="filter.getriebe"
                  class="mr-3 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                >
                  <option>Alle</option>
                  <option v-for="getrieb in getriebe" v-bind:key="getrieb">
                    {{ getrieb }}
                  </option>
                </select>
              </fieldset>
            </div>
            <div class="mt-3">
              <fieldset>
                <label for="Aktion" class="text-lg mr-5 text-green-400"
                  >Aktion</label
                >
                <select
                  v-model="filter.aktion"
                  class="mr-3 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
                >
                  <option>Keine Auswahl</option>
                  <option v-for="aktion in aktionen" v-bind:key="aktion.key">
                    {{ aktion.value }}
                  </option>
                </select>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </form>
    <!-- <div>
      <small>
        <pre>{{ filter }}</pre>
      </small>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterActive: false,
      filter: {
        type: "Neuwagen",
        aufLager: ["Bestand"],
        hersteller: "Alle",
        vhersteller: "",
        modell: "",
        erstzulassung: {
          from: null,
          to: null,
        },
        preis: {
          from: "",
          to: "",
        },
        kw: {
          from: "",
          to: "",
        },
        farbe: "",
        filiale: "Alle",
        standort: "Alle",
        ahid: "Alle",
        kraftstoff: "Alle",
        getriebe: "Alle",
        aktion: "Keine Auswahl",
        version: "",
        asettings: {},
        ssettings: [],
      },
      ausstattungen: [],
      standorte: [],
      eigentuemer: [],
      kraftstoffe: [],
      getriebe: [],
      aktionen: [],
      advancedFilters: false,
      legende: false,
    };
  },
  methods: {
    cleanAttributes() {
      this.filter = {
        type: "Neuwagen",
        aufLager: ["Bestand"],
        hersteller: "Alle",
        vhersteller: "",
        modell: "",
        erstzulassung: {
          from: null,
          to: null,
        },
        preis: {
          from: "",
          to: "",
        },
        kw: {
          from: "",
          to: "",
        },
        farbe: "",
        filiale: "Alle",
        standort: "Alle",
        ahid: "Alle",
        kraftstoff: "Alle",
        getriebe: "Alle",
        aktion: "Keine Auswahl",
        version: "",
        asettings: {},
        ssettings: [],
      };

      this.ausstattungen = this.$ausstattungen.sort();
      for (let i of this.ausstattungen) {
        this.filter.asettings[i] = false;
      }
    },
    formatQuery() {
      window.document.getElementById("main").scrollTop = 0;
      this.advancedFilters = false;
      /**
       * This contains a prototype query builder. Will be removed in production.
       */
      let data = {};

      let alias = this.filter.type;
      let aufLager = null;
      if (
        this.filter.aufLager.length === 1 &&
        this.filter.aufLager.includes("Bestand")
      )
        aufLager = true;
      if (
        this.filter.aufLager.length === 1 &&
        this.filter.aufLager.includes("Vorlauf")
      )
        aufLager = false;

      if (this.filter.aufLager.length === 2 || alias === "Gebrauchtwagen")
        aufLager = null;
      data.auflager = aufLager;

      if (this.filter.hersteller !== "Alle")
        data.hersteller = this.filter.hersteller;

      if (this.filter.aktion !== "Keine Auswahl")
        data.aktion = this.filter.aktion;

      if (this.filter.hersteller === "Sonstige" && !this.filter.vhersteller) {
        this.filter.hersteller = "Alle";
        data.hersteller = null;
      }

      if (this.filter.vhersteller) {
        data.hersteller = this.filter.vhersteller;
        this.filter.hersteller = "Sonstige";
      }

      if (this.filter.modell) data.modell = this.filter.modell;
      if (this.filter.version) data.version = this.filter.version;
      if (this.filter.farbe) data.farbe = this.filter.farbe;
      data.standort = null;
      if (this.filter.standort !== "Alle") data.standort = this.filter.standort;

      data.ahid = null;
      if (this.filter.ahid !== "Alle") data.ahid = this.filter.ahid;

      data.kraftstoff = null;
      if (this.filter.kraftstoff !== "Alle")
        data.kraftstoff = this.filter.kraftstoff;

      data.getriebe = null;
      if (this.filter.getriebe !== "Alle") data.getriebe = this.filter.getriebe;

      if (this.filter.optionen) {
        let fop = this.filter.optionen;
        fop = fop
          .split(/,/g)
          .map((x) => x.trim())
          .filter((x) => !!x);
        data.optionen = fop;
      } else data.optionen = [];

      let filterPart = {
        and: [],
      };

      if (data.auflager !== null)
        filterPart.and.push({
          field: "auflager",
          type: "match",
          operator: "is",
          query: data.auflager,
        });

      if (data.hersteller)
        filterPart.and.push({
          field: alias === "Neuwagen" ? "hersteller_dispo" : "hersteller",
          type: "match",
          operator: "is",
          query: data.hersteller,
        });

      if (data.aktion)
        filterPart.and.push({
          field: "aktionsBezeichnung",
          type: "match",
          operator: "is",
          query: data.aktion,
        });

      if (data.modell)
        filterPart.and.push({
          field: alias === "Neuwagen" ? "modell_dispo" : "modell",
          type: "wildcard",
          operator: "is",
          query: data.modell,
        });

      if (data.farbe)
        filterPart.and.push({
          field:
            alias === "Neuwagen"
              ? "herstellerfarbe"
              : "herstellerfarbe_fzgtool",
          type: "wildcard",
          operator: "is",
          query: data.farbe,
        });

      if (data.version)
        filterPart.and.push({
          field:
            alias === "Neuwagen" ? "model_text" : "ausstattungslinie_fzgtool",
          type: "wildcard",
          operator: "is",
          query: data.version,
        });

      if (data.optionen.length > 0)
        for (let o of data.optionen) {
          filterPart.and.push({
            field: "optionscodes",
            type: "wildcard",
            operator: "is",
            query: o,
          });
        }
      if (this.filter.preis.from || this.filter.preis.to)
        filterPart.and.push({
          field: alias === "Neuwagen" ? "listenpreis_upe_brutto" : "wwwpreis",
          type: "range",
          operator: "is",
          query: [
            this.filter.preis.from ? parseInt(this.filter.preis.from) : 0,
            this.filter.preis.to ? parseInt(this.filter.preis.to) : 1000000,
          ],
        });

      if (this.filter.kw.from || this.filter.kw.to)
        filterPart.and.push({
          field: "leistungkw",
          type: "range",
          operator: "is",
          query: [
            this.filter.kw.from ? parseInt(this.filter.kw.from) : 0,
            this.filter.kw.to ? parseInt(this.filter.kw.to) : 1000000,
          ],
        });

      if (this.filter.erstzulassung.from || this.filter.erstzulassung.to)
        filterPart.and.push({
          field:
            alias === "Neuwagen" ? "erstzulassung" : "erstzulassung_fzgtool",
          type: "range",
          operator: "is",
          query: [
            this.filter.erstzulassung.from
              ? `${String(this.filter.erstzulassung.from).split(/-/g)[0]}-${
                  String(this.filter.erstzulassung.from).split(/-/g)[1]
                }-01`
              : `1900-01-01`,
            this.filter.erstzulassung.to
              ? `${String(this.filter.erstzulassung.to).split(/-/g)[0]}-${
                  String(this.filter.erstzulassung.to).split(/-/g)[1]
                }-31`
              : `2050-12-31`,
          ],
        });

      if (this.filter.ssettings.length > 0) {
        for (let a of this.filter.ssettings) {
          filterPart.and.push({
            field: a,
            type: "match",
            operator: "is",
            query: true,
          });
        }
      }

      if (data.standort) {
        filterPart.and.push({
          field: "standort",
          type: "match",
          operator: "is",
          query: data.standort,
        });
      }

      if (data.ahid) {
        filterPart.and.push({
          field: "ahid",
          type: "match",
          operator: "is",
          query: data.ahid,
        });
      }

      if (data.kraftstoff) {
        filterPart.and.push({
          field: "kraftstoff",
          type: "match",
          operator: "is",
          query: data.kraftstoff,
        });
      }

      if (data.getriebe) {
        filterPart.and.push({
          field: "getriebe",
          type: "match",
          operator: "is",
          query: data.getriebe,
        });
      }

      let filterArray = [filterPart];

      let dataObj = {
        pagination: {
          page: 1,
          perPage: 50,
        },
        order:
          alias === "Neuwagen"
            ? "listenpreis_upe_brutto:desc"
            : "wwwpreis:desc",
        filter: filterArray,
      };

      this.$emit(
        "change",
        dataObj,
        alias === "Neuwagen" ? "cars_vk" : "cars_vk_gw"
      );
    },
  },
  watch: {
    advancedFilters(val) {
      if (val) {
        window.document
          .getElementById("main")
          .classList.remove("overflow-y-hidden");
      } else {
        window.document
          .getElementById("main")
          .classList.add("overflow-y-hidden");
      }
    },
  },
  beforeMount() {
    this.ausstattungen = this.$ausstattungen.sort();
    for (let i of this.ausstattungen) {
      this.filter.asettings[i] = false;
    }
    this.$http
      .get(`${this.$wib}/612`)
      .then((res) => {
        if (res.status === 200) {
          this.aktionen = res.data.sort(
            (a, b) => parseInt(b.key) - parseInt(a.key)
          );
        }
      })
      .catch((err) => console.error(err));
    this.standorte = this.$standorte;
    this.eigentuemer = this.$eigentuemer;
    this.kraftstoffe = this.$kraftstoff;
    this.getriebe = this.$getriebe;
    this.cleanAttributes();
  },
};
</script>

<style>
#legende {
  z-index: 1000;
  position: fixed;
  right: 1rem;
  top: 0.1rem;
  background-color: white;
  margin: 1rem;
  padding: 1rem;
}
</style>