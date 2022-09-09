import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";

axios.defaults.baseURL = "http://localhost:3000/api";

const user = localStorage.getItem("user");
if (user) {
  const userDecoded = JSON.parse(user);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userDecoded.token}`;
}

createApp(App).use(store).use(router).use(VueAxios, axios).mount("#app");
