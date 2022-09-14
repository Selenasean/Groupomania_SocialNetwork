import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

// defined baseUrl so we don't have to write all the URL in request
const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

createApp(App).use(router).use(VueAxios, instance).mount("#app");
