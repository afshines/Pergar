import axios from "axios";

const URL_BASE = process.env.VUE_APP_BASE_SARVER_URL;
const URL_MEDIA = URL_BASE + "media";
const URL_MEDIA_ALL = URL_BASE + "media_all";

import { createHelpers } from "vuex-map-fields";
const { getField, updateField } = createHelpers({
  getterType: "getField",
  mutationType: "updateField",
});

const state = {
  id: null,
  title: "",
  location: "",
  name: "",
  icon: "",
  status: true,
  domain: "",
  locations: [],
  errors: [],
  edit: false,
  media: [],
  tableData: {
    data: [],
    total: 0,
    pagination: {
      page: 1,
      itemsPerPage: 15,
    },
    headers: [

      { text: "نام", value: "name", sortable: true },
      { text: "دامنه", value: "domain", sortable: true },
      { text: "آیکون", value: "icon", sortable: false },
      { text: "کلیدرسانه",value: "_id", sortable: false},
      { text: "وضعیت", value: "status", sortable: true },
      { text: "", value: "actions", sortable: false },
    ],
  },
};

const getters = {
  getField,
  Media: (state) => state.media,
  TableData: (state) => state.tableData,
  Pagination: (state) => state.tableData.pagination,
};

const actions = {

  async getAll({ commit }) {
    await axios
      .get(URL_MEDIA_ALL, {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
        return commit("GETALL", response.data);
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },

  async getOne({ commit }, _id) {
    await axios
      .get(URL_MEDIA + "/" + _id, {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
        return commit("GETONE", response.data);
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },
  async search({ commit, state }, { name }) {
    await axios
      .get(
        URL_MEDIA +
        "/searchAll?name=" +
        name +
        "&perPage=" +
        state.tableData.pagination.itemsPerPage +
        "&page=" +
        state.tableData.pagination.page,
        {
          headers: this.getters["authentication/getHeader"](),
        }
      )
      .then((response) => {
        return commit("GETSEARCH", response.data);
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },

  async add_location({ state, commit }) {
    state.locations.push({title:state.title,location:state.location});
    return commit("CLEAR_TITLE");
  },
  async remove_location({ state }, index) {

    state.locations.splice(index, 1);
  },

  async insert({ state, commit }) {

    const form_data = { name: state.name, icon: state.icon, status: state.status, domain: state.domain, locations: state.locations };

    if (!state.edit) {
      return await axios
        .post(URL_MEDIA, form_data, {
          headers: this.getters["authentication/getHeader"](),
        })
        .then((response) => {
          commit("INSERTED", response.data);
          return response.data;
        })
        .catch((err) => {
          return commit("ERROR", err);
        });
    }
  },

  async update({ state, commit }) {

    const form_data = { name: state.name, icon: state.icon, status: state.status, domain: state.domain, locations: state.locations };

    if (state.edit) {
      return await axios
        .put(URL_MEDIA + "/" + state.id, form_data, {
          headers: this.getters["authentication/getHeader"](),
        })
        .then((response) => {
          commit("UPDAETED");
          return response.data;
        })
        .catch((err) => {
          return commit("ERROR", err);
        });
    }
  },

  async delete({ state, commit }) {
    await axios
      .delete(
        URL_MEDIA + "/" + state.id,
        {
          headers: this.getters["authentication/getHeader"](),
        }
      )
      .then((response) => {


        ///Remove all news of this media


        return commit("DELETED");
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },
  async clear({ commit }) {
    return commit("UPDAETED", {});
  },

};

const mutations = {
  updateField,

  GETSEARCH: (state, data) => {
    state.tableData.data = data.items;
    state.tableData.total = data.total;
  },
  GETONE: (state, data) => {
    state.id = data._id;
    state.name = data.name;
    state.icon = data.icon;
    state.status = data.status;
    state.domain = data.domain;
    state.locations = data.locations;
    state.edit = true;
  },

  GETALL: (state, data) => {
    state.media = data.media;
  },

  INSERTED: (state) => {
    state.id = null;
    state.name = "";
    state.icon = "";
    state.status = true;
    state.domain = "";
    state.locations = [];
    state.edit = false;
  },

  UPDAETED: (state) => {
    state.id = null;
    state.name = "";
    state.icon = "";
    state.status = true;
    state.domain = "";
    state.locations = [];
    state.edit = false;
  },
  CLEAR_TITLE: (state) => {
    state.title = "";
    state.location = "";
  },
  DELETED: () => {
    state.id = null;
    state.name = "";
    state.icon = "";
    state.status = true;
    state.domain = "";
    state.locations = [];
    state.edit = false;
  },
  ERROR: () => { },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
