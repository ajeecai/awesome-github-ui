import { createStore } from "vuex";

import auth from "./auth/index";
import langs from "./langs/index";

const store = createStore({
  modules: {
    auth,
    langs,
  },
  state() {
    return {
      API_URL: "",
    };
  },
  getters: {
    apiUrl(state) {
      return state.API_URL;
    },
  },
});

export default store;
