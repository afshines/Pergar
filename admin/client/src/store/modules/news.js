import axios from "axios";

const URL_BASE = process.env.VUE_APP_BASE_SARVER_URL;
const URL_NEWS = URL_BASE + "news";

import { createHelpers } from "vuex-map-fields";
const { getField, updateField } = createHelpers({
  getterType: "getField",
  mutationType: "updateField",
});

const state = {
  id: null,
  title: "",
  media_id: null,
  locations_selected: [],
  status: true,
  url: "",

  selected: [],
  errors: [],
  edit: false,
  tableData: {
    data: [],
    total: 0,
    pagination: {
      page: 1,
      itemsPerPage: 15,
    },
    headers: [
      { text: "ردیف", value: "_id", sortable: true },
      { text: "عنوان", value: "title", sortable: true },
    
      { text: "رسانه ها", value: "media", sortable: false },
      { text: "وضعیت", value: "status", sortable: true },
      { text: "", value: "actions", sortable: false },
    ],
  },
};

const getters = {
  getField,

  TableData: (state) => state.tableData,
  Pagination: (state) => state.tableData.pagination,
};

const actions = {
  async getOne({ commit }, _id) {
    await axios
      .get(URL_NEWS + "/" + _id, {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
        return commit("GETONE", response.data);
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },
  async getLocations({ commit, state }) {
   return  await axios
      .get(URL_NEWS + "/getLocationsByNews/" + state.id + "/" + state.media_id, {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
         commit("GETONELOCATIONS", response.data);
         return response.data;
      })
      .catch((err) => {
         commit("ERROR", err);
        return null;
      });
  },
  async search({ commit, state }, { title, media_id }) {
    await axios
      .get(
        URL_NEWS +
        "/searchAll?title=" +
        title +
        "&media_id=" +
        media_id +
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

  async insert({ state, commit }) {

    const form_data = { title: state.title, status: state.status, url: state.url };

    if (!state.edit) {
      return await axios
        .post(URL_NEWS, form_data, {
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
  async addToLocation({ state, commit }) {

    if (state.edit) {

      state.locations_selected.map(async (location) => {
        let location_id = location._id;
        await axios
          .post(URL_NEWS + "/addToLocation/" + state.id + "/" + state.media_id + "/" + location_id, {}, {
            headers: this.getters["authentication/getHeader"](),
          })
          .then(() => {

          })
          .catch((err) => {
            return commit("ERROR", err);
          });

      })

      return commit("ADDED");
    }
  },
  async update({ state, commit }) {

    const form_data = { title: state.title, status: state.status, url: state.url };

    if (state.edit) {
      return await axios
        .put(URL_NEWS + "/" + state.id, form_data, {
          headers: this.getters["authentication/getHeader"](),
        })
        .then((response) => {
          commit("UPDAETED", response.data);
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
        URL_NEWS + "/" + state.id,
        {
          headers: this.getters["authentication/getHeader"](),
        }
      )
      .then((response) => {


        return commit("DELETED");
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },
  async deleteFromMedia({ state, commit }) {
    await axios
      .delete(
        URL_NEWS + "/media/" + state.id + "/" + state.media_id,
        {
          headers: this.getters["authentication/getHeader"](),
        }
      )
      .then(() => {

        return commit("DELETEDMEDIA");
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },
  async deleteAll({ state, commit }) {
    await state.selected.map(async (candidate) => {
      await axios
        .delete(
          URL_NEWS + "/" + candidate._id,
          {
            headers: this.getters["authentication/getHeader"](),
          }
        )
        .then(() => {
        })
        .catch((err) => {
          return commit("ERROR", err);
        });
    })


    return commit("DELETED", {});
  },

  clear({commit} ){
    return commit("CLEAR");
  }
};

const mutations = {
  updateField,

  GETSEARCH: (state, data) => {
    state.tableData.data = data.items;
    state.tableData.total = data.total;
  },
  GETONE: (state, data) => {
    state.id = data._id;
    state.title = data.title;
    state.media_id = null;
    state.locations_selected = [];
    state.status = data.status;
    state.url = data.url;

    state.edit = true;
  },

  GETONELOCATIONS: () => { },

  INSERTED: (state,data) => {
    state.id = data._id;
    state.title = data.title;
    state.media_id = null;
    state.locations_selected = [];
    state.status = data.status;
    state.url = data.url;
   
    state.edit = true;
  },

  UPDAETED: (state) => {
    state.id = null;
    state.title = "";
    state.media_id = null;
    state.locations_selected = [];
    state.status = true;
    state.url = "";

    state.edit = false;
  },

  DELETED: (state) => {
    state.id = null;
    state.title = "";
    state.media_id = null;
    state.locations_selected = [];
    state.status = true;
    state.url = "";

    state.edit = false;
  },
  CLEAR(){
    state.id = null;
    state.title = "";
    state.media_id = null;
    state.locations_selected = [];
    state.status = true;
    state.url = "";

    state.edit = false;
  },
  DELETEDMEDIA: () => {

 

  },
  ADDED: () => { },
  ERROR: () => { },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
