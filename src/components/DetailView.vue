<template>
  <div id="car-details" class="m-5">
    <!-- <pre>
      {{ reserviert }}
    </pre> -->
    <loading-modal :show="isLoading" />
    <div v-show="!isLoading">
      <h1 class="text-xl font-bold">
        {{
          carData.hersteller
            ? carData.hersteller
            : carData.hersteller_dispo
            ? carData.hersteller_dispo
            : ""
        }}
        {{
          carData.modell
            ? carData.modell
            : carData.modell_dispo
            ? carData.modell_dispo
            : ""
        }}
        {{
          carData.modelltyp
            ? carData.modelltyp
            : carData.model_text
            ? carData.model_text
            : ""
        }}
      </h1>
      <!-- <pre>{{ carData }}</pre> -->
      <p class="text-base italic">
        {{
          carData.bestellnummer
            ? carData.bestellnummer
            : carData.ordernummer
            ? carData.ordernummer
            : carData.bestellnr
            ? carData.bestellnr
            : ""
        }}
        {{ carData.fahrgestellnr ? `/ ${carData.fahrgestellnr}` : "" }}
      </p>
      <p class="text-base italic">
        <span v-if="type === 'GW'">{{ carData.gebrauchtyp_fzgtool }}</span>
        <span v-else>{{ carData.gebrauchtyp }}</span>
      </p>
      <p class="text-pink-600 text-base font-bold" v-if="carData.strategisch">
        Fahrzeug ist zur Zulassung
        <span v-if="carData.geplante_zulassung_als"
          >als {{ carData.geplante_zulassung_als }}</span
        >
        <span v-if="carData.strategischMonat">
          für {{ carData.strategischMonat }}</span
        >
        geplant
      </p>
      <p
        class="text-pink-600 text-base font-bold"
        v-if="
          carData.haltedauer_datum &&
          new Date(carData.haltedauer_datum).getTime() > Date.now()
        "
      >
        In Haltedauer bis {{ carData.haltedauer_datum_f }}
      </p>
      <p v-if="reserviert.timestamp" class="text-red-400 text-sm">
        Reserviert von {{ reserviert.name }} am
        {{ new Date(reserviert.timestamp).toLocaleString() }}
        Uhr
        <span v-if="reserviert.tsexpired">
          <br />
          Läuft ab:
          {{ new Date(reserviert.tsexpired).toLocaleString() }} Uhr</span
        >
        <span>
          <br />
          <label
            for="reserveComment"
            class="m-2 text-teal-400 text-lg mr-5 ml-0"
            >Reserviert für</label
          >
          <input
            id="resComment"
            v-model="reserveComment"
            placeholder="Kommentar"
            class="placeholder-gray-500 border border-gray-500 text-teal-400 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
            @keydown.enter="changeComment"
            @blur="changeComment"
            v-if="user === reserviert.cnum"
          />
          <span class="text-teal-400 pt-1 pb-1 pl-2 pr-2 text-lg" v-else>{{
            reserveComment
          }}</span>
          <button
            class="mt-1 ml-2 bg-teal-400 text-white font-bold py-1 px-5 rounded-lg"
            v-if="user === reserviert.cnum"
            :disabled="
              reserveComment === carData.reserviertComment || !reserveComment
            "
            :class="[
              {
                'hover:bg-teal-500':
                  reserveComment !== carData.reserviertComment ||
                  reserveComment,
              },
              {
                'bg-teal-600':
                  reserveComment === carData.reserviertComment ||
                  !reserveComment,
              },
            ]"
            @click="changeComment"
          >
            {{
              reserveComment === carData.reserviertComment || !reserveComment
                ? "OK"
                : "Speichern"
            }}</button
          ><br />
        </span>
        <span class="text-red-500 text-sm" v-if="user === reserviert.cnum">
          <button @click="cancelReservation">[-Reservierung löschen-]</button>
        </span>
      </p>
      <div class="grid grid-cols-2" style="width: 25rem">
        <div class="col-span-1">
          <button
            class="mt-1 mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
            @click="openJR"
          >
            JobRouter
          </button>
        </div>
        <div class="col-span-1">
          <button
            class="mt-1 mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
            @click="openMobile"
            v-if="carData.mobileid"
          >
            Mobile
          </button>
        </div>
        <div class="col-span-5"></div>
        <div class="col-span-1">
          <button
            class="mt-1 mr-5 bg-teal-400 text-white font-bold py-1 px-5 rounded-lg"
            :class="[
              { 'hover:bg-teal-500': !carData.fzgReserviertInfo },
              { 'bg-teal-600': carData.fzgReserviertInfo },
            ]"
            :disabled="carData.fzgReserviertInfo"
            @click="reserveCar"
          >
            Reservieren
          </button>
        </div>
        <div class="col-span-1">
          <button
            class="mt-1 mr-5 bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
            @click="openPreisblatt"
          >
            Preisblatt
          </button>
        </div>
        <div class="col-span-5"></div>
      </div>
      <span v-if="hasImage">
        <div class="grid grid-cols-2 mb-5 mt-3">
          <div class="col-span-2">
            <span
              class="text-center italic text-sm mb-0 pb-0"
              v-if="images.length > 1"
              >{{ images.length }} Bilder</span
            >
            <img class="mb-3 w-full" :src="image" />
          </div>
          <!-- <div class="col-span-6"></div> -->
          <div class="p-0 m-0" v-if="images.length > 1">
            <a @click="prevImage" class="hover:cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                /></svg
            ></a>
          </div>
          <div class="p-0 m-0" v-if="images.length > 1">
            <a @click="nextImage" class="hover:cursor-pointer float-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                /></svg
            ></a>
          </div>
        </div>
      </span>
      <p class="text-large italic mt-5 mb-5" v-else>Kein Bild vorhanden</p>
      <table style="width: 25rem" class="table-auto mt-2 mb-2">
        <tr class="text-lg font-bold" v-if="carData.listenpreis_upe_brutto">
          <td>Preis (UPE brutto)</td>
          <td>{{ carData.listenpreis_upe_brutto }}</td>
        </tr>
        <tr class="text-xl font-bold" v-if="carData.wwwpreis">
          <td>Hauspreis</td>
          <td>{{ carData.wwwpreis }}</td>
        </tr>
      </table>
      <table
        style="width: 25rem"
        class="table-auto border border-teal-400 mb-5"
      >
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.bemerkung"
        >
          <td>Bemerkung/Hinweis</td>
          <td>{{ carData.bemerkung }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.schluesselnummer"
        >
          <td>Schlüsselnummer</td>
          <td>{{ carData.schluesselnummer }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.hsn"
        >
          <td>HSN</td>
          <td>{{ carData.hsn }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.tsn"
        >
          <td>TSN</td>
          <td>{{ carData.tsn }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.zl_info"
        >
          <td>Erstzulassung</td>
          <td>{{ carData.zl_info }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.herstellerfarbe"
        >
          <td>Farbe</td>
          <td>{{ carData.herstellerfarbe }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.leistungkw"
        >
          <td>Leistung (KW)</td>
          <td>{{ carData.leistungkw }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.kraftstoff"
        >
          <td>Kraftstoff</td>
          <td>{{ carData.kraftstoff }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer border-b"
          v-if="carData.kilometerstand"
        >
          <td>Kilometerstand</td>
          <td>{{ carData.kilometerstand }}</td>
        </tr>
        <tr
          class="hover:bg-teal-300 hover:cursor-pointer"
          v-if="carData.optionscodes"
        >
          <td>Optionscodes</td>
          <td>{{ carData.optionscodes }}</td>
        </tr>
      </table>
      <hr style="width: 25rem" />
      <input
        type="text"
        v-model="filter"
        placeholder="Filter"
        class="mt-2 mb-2 placeholder-gray-500 border border-gray-500 focus:border-teal-200 rounded-full pt-1 pb-1 pl-2 pr-2 text-sm focus:outline-none"
      />
      <div style="width: 25rem" class="relative w-full">
        <span
          v-for="(detail, i) of actualDetails"
          v-bind:key="i"
          class="float-left relative capitalize bg-teal-500 hover:bg-teal-400 text-center text-sm text-white font-bold py-1 px-3 rounded-md mr-1 mb-2"
        >
          {{ detail }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      type: null,
      id: null,
      hasImage: null,
      image: null,
      images: [],
      carData: {},
      showDetails: [],
      filter: "",
      hasDetails: [],
      user: "A999",
      reserviert: {
        timestamp: null,
        tsexpired: null,
        name: null,
        cnum: null,
      },
      reserveComment: null,
    };
  },
  computed: {
    actualDetails() {
      return this.filter
        ? this.hasDetails.filter((x) => new RegExp(this.filter, "g").test(x))
        : this.hasDetails;
    },
  },
  methods: {
    openJR() {
      this.$openExternal(
        `http://intranet.dieschneidergruppe.de/ntlm/index.php?cmd=StepScreen&jrprocessname=AllgemeineFunktionen&jrversion=1&jrstep=10&tb_typ=${this.type}&tb_fzg_id=${this.id}`
      );
    },
    openMobile() {
      this.$openExternal(
        `https://suchen.mobile.de/fahrzeuge/details.html?id=${this.carData.mobileid}`
      );
    },
    openPreisblatt() {
      let pbId = 1;
      if (this.carData.datenbank === "deja01") {
        pbId = 6;
      } else if (this.type.toLowerCase() === "gw") pbId = 5;
      this.$openExternal(
        `http://intranet.dieschneidergruppe.de/data/DSG_Module/preisblatt.php?preisblattid=${pbId}&fzgid=${this.id}`
      );
    },
    setReserveString(info) {
      if (!info) {
        console.log(`No Reservation, cleanup`);
        this.reserviert = null;
        this.reserviert = {
          name: null,
          cnum: null,
          timestamp: null,
          tsexpired: null,
        };
        return;
      }
      info = info.split(/;/g).map((x) => x.trim());
      this.reserviert = {
        name: info[1],
        cnum: info[0],
        timestamp: info[2],
        tsexpired: info[3] ? info[3] : null,
      };
    },
    async changeComment() {
      if (this.user !== this.reserviert.cnum) {
        return;
      }

      if (
        !this.reserveComment ||
        this.reserveComment === this.carData.reserviertComment
      )
        return;

      let res = await this.$http.post(`http://jobrouter4:5015/comment`, {
        id: this.id,
        comment: this.reserveComment,
      });

      if (res.status === 200) await this.gatherData();
      else alert(`${res.status} - ${res.data.error}`);
    },
    async reserveCar() {
      await this.gatherData();
      if (this.carData.fzgReserviertInfo) {
        alert("Für dieses Fahrzeug liegt bereits eine Reservierung vor.");
      }
      let dummyData = {
        cnum: "A999",
        name: "Testermann, Tester",
        timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, -5),
      };
      let data = dummyData;
      if (window.$system && window.$system.username) {
        data.cnum = window.$system.user.username;
        data.name = `${window.$system.user.lastname}, ${window.$system.user.prename}`;
      }
      let reserviertInfo = `${data.cnum}; ${data.name}; ${data.timestamp}`;
      let id = this.id;

      let res = await this.$http.post(`http://jobrouter4:5015/reserve`, {
        id,
        reserviertInfo,
      });
      if (res.status === 200) {
        this.setReserveString(reserviertInfo);
      } else {
        if (!res.data.success) alert(`${res.status} - ${res.data.err}`);
        else alert(`${res.status} - ${res.data.message}`);
      }
    },
    async cancelReservation() {
      let dummyData = {
        cnum: "A999",
        name: "Testermann, Tester",
        timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, -5),
      };
      let data = dummyData;
      if (window.$system && window.$system.username) {
        data.cnum = window.$system.user.username;
        data.name = `${window.$system.user.lastname}, ${window.$system.user.prename}`;
      }
      let id = this.id;

      let res = await this.$http.post(
        `http://jobrouter4:5015/cancelreservation`,
        {
          id,
        }
      );
      if (res.status === 200) {
        this.carData.fzgReserviertInfo = "";
        this.reserviert = null;
        this.reserviert = {
          timestamp: null,
          name: null,
          cnum: null,
        };
      }
    },
    async generateImage() {
      try {
        /**
         *
         */
        let vin = this.carData.fahrgestellnr;
        let fairyUrl = `https://cdn1.dieschneidergruppe.de/images/v1/status/${vin}`;
        let fairyRes = await this.$http.get(fairyUrl);
        if (fairyRes.data) {
          let fairyData = fairyRes.data;
          if (fairyData.found && fairyData.images.length > 0) {
            this.images = fairyData.images.map(
              (x) => `https://cdn1.dieschneidergruppe.de/images/v1/raw${x}`
            );
          }
        }
        this.hasImage = this.images.length > 0;
        this.image = this.images[0];

        if (this.hasImage) return;

        /**
         *
         */
        let checkPictureUrl = `http://jobrouter4:5014/hasimage/${this.id}`;
        let result = await this.$http.get(checkPictureUrl);
        if (result.status !== 200)
          throw `Fehler beim Überprüfen der Bilder-URL`;
        let data = result.data;
        this.hasImage = data.success;
        this.images = [data.image];
        this.image = data.image;
      } catch (err) {
        console.error(err);
        this.hasImage = false;
      } finally {
        this.isLoading = false;
      }
    },
    nextImage() {
      this.image = this.images[
        ((i, l) => (i + 1 <= l ? i + 1 : 0))(
          this.images.indexOf(this.image),
          this.images.length - 1
        )
      ];
    },
    prevImage() {
      this.image = this.images[
        ((i, l) => (i - 1 >= 0 ? i - 1 : l))(
          this.images.indexOf(this.image),
          this.images.length - 1
        )
      ];
    },
    async gatherData() {
      let dataUrl = `${this.$endpoints["esapi"]}/api/v3/cars/index/${this.id}`;
      let result = await this.$http.get(dataUrl);
      let data = result.data;
      if (!data.success) return;
      data = data.car._source;
      data.zl_info = null;
      if (data.erstzulassung_fzgtool) data.zl_info = data.erstzulassung_fzgtool;
      else if (data.erstzulassung) data.zl_info = data.erstzulassung;
      const fDatum = (datum) =>
        datum
          ? ((d) =>
              `${String(d.getUTCDate()).padStart(2, "0")}.${String(
                d.getUTCMonth() + 1
              ).padStart(2, "0")}.${String(d.getUTCFullYear())}`)(
              new Date(datum)
            )
          : null;
      const fEz = (ez) =>
        ez
          ? ((d) =>
              `${String(d.getUTCMonth() + 1).padStart(
                2,
                "0"
              )}/${d.getUTCFullYear()}`)(new Date(ez))
          : null;
      const fPreis = (d) =>
        d
          ? `${d
              .toFixed(2)
              .replace(".", ",")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}€`
          : null;
      data.zl_info = fEz(data.zl_info);
      data.listenpreis_upe_brutto = fPreis(data.listenpreis_upe_brutto);
      data.wwwpreis = fPreis(data.wwwpreis);
      data.haltedauer_datum_f = fDatum(data.haltedauer_datum);
      if (
        data.hersteller_dispo &&
        (data.hersteller_dispo === "Jaguar" ||
          data.hersteller_dispo === "Land Rover")
      ) {
        let oc = data.optionscodes.split(/,/g);
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
        else oc = data.optionscodes;
        data.optionscodes = oc ? oc : null;
      }

      this.carData = data;
      if (data.fzgReserviertInfo !== undefined)
        this.setReserveString(data.fzgReserviertInfo);

      if (
        data.reserviertComment &&
        window.document.activeElement.id !== "resComment"
      )
        this.reserveComment = data.reserviertComment;
      window.document.title = `
       ${
         data.hersteller
           ? data.hersteller
           : data.hersteller_dispo
           ? data.hersteller_dispo
           : ""
       }
        ${
          data.modell ? data.modell : data.modell_dispo ? data.modell_dispo : ""
        }
        ${
          data.modelltyp
            ? data.modelltyp
            : data.model_text
            ? data.model_text
            : ""
        } - Schneider Gruppe`;
      let details = Object.keys(data).filter((x) =>
        this.showDetails.includes(x)
      );
      details = details.filter((x) => !!data[x]);
      if (data.klimaanlage) details.push(data.klimaanlage.toLowerCase());
      if (data.tagfahrlicht_dropdown)
        details.push(data.tagfahrlicht_dropdown.toLowerCase());
      if (data.innenausstattung)
        details.push(data.innenausstattung.toLowerCase());
      this.hasDetails = details.sort();
    },
  },
  async beforeMount() {
    this.type = this.$route.params.type;
    this.id = this.$route.params.id;
    this.showDetails = this.$ausstattungen;
    await this.gatherData();
    let vm = this;
    setInterval(() => {
      vm.gatherData();
    }, 30000);
    this.generateImage();
  },
  mounted() {
    window.document
      .getElementById("main")
      .classList.remove("overflow-y-hidden");

    if (window.$system && window.$system.username)
      this.user = window.$system.username;
  },
};
</script>

<style>
</style>