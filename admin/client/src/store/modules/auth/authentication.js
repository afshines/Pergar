import axios from "axios";
import storage from "local-storage-fallback";

import router from "../../../router";

import { createHelpers } from "vuex-map-fields";

const BASE_URL = process.env.VUE_APP_BASE_SARVER_URL + "authentication/";
const BASE_URL_ZERO = process.env.VUE_APP_BASE_SARVER_URL;

const { getField, updateField } = createHelpers({
  getterType: "getField",
  mutationType: "updateField",
});

const state = {
  name: "",
  mobile: "",
  code: null,
  roles: [],
  authError: null,
  errorOnLogin: "",
  authenticated: storage.getItem("Token"),
  resetPass: false,
  login: true,
  register: false,
};

const getters = {
  getField,
  getState(state) {
    return () => {
      let data = {};
      data = {
        login: state.login,
        register: state.register,
        resetPass: state.resetPass,
      };
      return data;
    };
  },

  getHeader() {
    return () => {
      let headers = {};
      headers = {
        "Content-Type": "application/json",
        Authorization: storage.getItem("Token"),
      };
      return headers;
    };
  },

  getToken() {
    return () => {
      return "token=" + storage.getItem("Token");
    };
  },

  isAuthenticated() {
    return () => {
      return (state.authenticated)
    };
  },

  infoLogin(state) {
    return {
      error: state.errorOnLogin,
      AuthError: state.authError,
    };
  },
};

const actions = {

  logout({ commit }) {
    if (this.getters["authentication/isAuthenticated"]()) {
      clearToken(commit);
    }
  },

  async getProfile({ commit }) {
    return await axios
      .get(BASE_URL_ZERO + "me", {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
        commit("Get", response.data);
        return response.data
      }).catch(() => {
        commit("AuthToken");
        return null
      });
  },


  signin({ commit }, { mobile, code }) {
    const data = {
      mobile: mobile,
      code: code,
    };

    let config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post(BASE_URL + "login/", data, config.headers)
      .then((res) => {

        if (res.data.token !== undefined) {
          saveToken(res.data.token, commit);
        } else commit("AuthError", res.data);
      })
      .catch(({ response }) => {
        commit("AuthError", response.data);
      });
  },

  signup(
    { commit },
    {
      mobile,
      name,
    }
  ) {
    const data = {
      mobile: mobile,
      name: name,
    };

    axios
      .post(BASE_URL + "register", data)
      .then(() => {
        commit("showLoginForm");
      })
      .catch(({ response }) => {
        commit("AuthError", response.data);
      });
  },

  _showLoginForm({ commit }) {
    commit("showLoginForm");
  },
  _showRegisterForm({ commit }) {
    commit("showRegisterForm");
  },
  _showResetForm({ commit }) {
    commit("showResetForm");
  },
};

const mutations = {
  updateField,

  RESET_PASS() { },

  Get(state, data) {
    state.profile = data;
  },

  UPDATE_PROFILE() { },

  Auth(state) {
    state.authenticated = true;
    state.authError = false;
    state.login = false;
    state.register = false;
    state.resetPass = false;
    router.push({ name: "Home" });
  },
  Logout(state) {
    state.authenticated = false;

    state.mobile = "";
    state.code = null;
    state.authError = false;
    state.login = true;
    state.register = false;
    state.resetPass = false;
    router.push({ name: "Login" });
  },

  AuthToken() {
    storage.removeItem("Token");
  },

  AuthError(state) {
    state.authError = true;

  },

  showLoginForm(state) {
    state.login = true;
    state.register = false;
    state.mobile = "";
    state.name = "";
    state.code = null;

    state.resetPass = false;
    state.authError = null;
  },
  showRegisterForm(state) {
    state.login = false;
    state.register = true;
    state.mobile = "";
    state.name = "";
    state.code = null;
    state.resetPass = false;
    state.authError = null;
  },

  showResetForm(state) {
    state.login = false;
    state.register = false;
    state.resetPass = true;
    state.authError = null;
  },

  Token: () => { },
};

function clearToken(cb) {
  storage.removeItem("Token");

  cb("Logout");
}

function saveToken(_token, cb) {
  storage.setItem("Token", "Bearer " + _token);

  cb("Auth");
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
