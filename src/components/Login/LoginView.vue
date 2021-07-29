<template>
  <div class="login-view">
    <div class="container mx-auto">
      <div class="flex content-center flex-wrap mt-10">
        <div class="w-auto"><schneidergruppe color="#000" /></div>
        &nbsp;
        <h1 class="pl-3 font-bold font-bold">Fahrzeugsuche</h1>
      </div>
      <div>
        <form v-on:submit.prevent="login">
          <div
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col mt-4"
          >
            <div class="mb-4">
              <label
                class="block text-grey-darker text-sm font-bold mb-2"
                for="username"
              >
                Benutzername
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                id="username"
                v-model="credentials.username"
                type="text"
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-grey-darker text-sm font-bold mb-2"
                for="password"
              >
                Passwort
              </label>
              <input
                class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                v-model="credentials.password"
                id="password"
                type="password"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                @click="login"
                class="bg-teal-400 hover:bg-teal-500 text-white font-bold py-1 px-5 rounded-lg"
                type="submit"
              >
                Login
              </button>
            </div>
            <div
              class="flex items-center justify-between mt-3"
              v-if="errorField.show"
            >
              <p class="text-red" v-html="errorField.text"></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        username: null,
        password: null,
      },
      errorField: {
        show: false,
        text: null,
      },
    };
  },
  methods: {
    login() {
      this.errorField.show = false;
      if (!this.credentials.username) {
        this.errorField.text = `Bitte geben Sie einen Benutzernamen ein!`;
        this.errorField.show = true;
        return;
      }
      if (!this.credentials.password) {
        this.errorField.text = `Bitte geben Sie ein Passwort ein!`;
        this.errorField.show = true;
        return;
      }
      const data = {
        username: this.credentials.username,
        password: this.credentials.password,
      };

      this.$http
        .post(`${this.$endpoints.esapi}/auth/login`, data)
        .then((res) => {
          let data = res.data;
          if (!data.success) throw "Unsuccessfull database try";
          if (data.success && !data.token) {
            this.errorField.text = `Ihren Daten konnte kein gültiger Benutzer zugeordnet werden!<br>Bitte überprüfen Sie Ihre Eingaben`;
            this.errorField.show = true;
            return;
          } else {
            localStorage.setItem("token", data.token);
            this.$store.dispatch("updateToken");
            this.$router.push("/");
          }
        })
        .catch((err) => {
          console.error(err);
          this.errorField.text = `Fehler mit dem Authentifizierungsserver!<br>Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an einen Administrator!`;
          this.errorField.show = true;
        });
    },
  },
};
</script>

<style>
</style>