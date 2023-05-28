import axios from "axios";

const URL_BASE = process.env.VUE_APP_BASE_SARVER_URL;
const URL_RSS = URL_BASE + "rss";
const URL_FEED = URL_BASE + "feed";

import { createHelpers } from "vuex-map-fields";
const { getField, updateField } = createHelpers({
  getterType: "getField",
  mutationType: "updateField",
});

const state = {
  id: null,
  title: "",
  max_new_feeds: 10,
  status: true,
  url: "",
  errors: [],
  edit: false,
  rss: [],
  tableData: {
    data: [],
    total: 0,
    pagination: {
      page: 1,
      itemsPerPage: 15,
    },
    headers: [

      { text: "نام", value: "title", sortable: true },
      { text: "آدرس", value: "url", sortable: true },
      { text: "تعداد", value: "max_new_feeds", sortable: false },
      { text: "وضعیت", value: "status", sortable: true },
      { text: "", value: "actions", sortable: false },
    ],
  },
};

const getters = {
  getField,
  Rss: (state) => state.rss,
  TableData: (state) => state.tableData,
  Pagination: (state) => state.tableData.pagination,
};

const actions = {

  async getAll({ commit }) {
    await axios
      .get(URL_FEED, {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
        return commit("GETALL", response.data);
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },


  async removeLoc ({ state, commit },{location_selected , media_id , selectedRssItem}) {
    const form_data = { 
      
      location_selected: location_selected, 
      media_id: media_id, 
      selectedRssItem: selectedRssItem
    
      };

   
      return await axios
        .post(URL_FEED+ "/removeToLocation", form_data, {
          headers: this.getters["authentication/getHeader"](),
        })
        .then((response) => {
          commit("REMOVED", response.data);
          return response.data;
        })
        .catch((err) => {
          return commit("ERROR", err);
        });
  },


  async addToLoc({ state, commit },{location_selected , media_id , selectedRssItem ,  limit}) {

    const form_data = { 
      
      location_selected: location_selected, 
      media_id: media_id, 
      limit: limit,
      selectedRssItem: selectedRssItem
    
      };

   
      return await axios
        .post(URL_FEED+ "/addToLocation", form_data, {
          headers: this.getters["authentication/getHeader"](),
        })
        .then((response) => {
          commit("ADDED", response.data);
          return response.data;
        })
        .catch((err) => {
          return commit("ERROR", err);
        });
    
  },

  async getOne({ commit }, _id) {
    await axios
      .get(URL_RSS + "/" + _id, {
        headers: this.getters["authentication/getHeader"](),
      })
      .then((response) => {
        return commit("GETONE", response.data);
      })
      .catch((err) => {
        return commit("ERROR", err);
      });
  },
  async search({ commit, state }) {
    await axios
      .get(
        URL_RSS +
        "/searchAll?"+
        "perPage=" +
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

    const form_data = { title: state.title, max_new_feeds: state.max_new_feeds, status: state.status, url: state.url  };

    if (!state.edit) {
      return await axios
        .post(URL_RSS, form_data, {
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

    const form_data = { title: state.title, max_new_feeds: state.max_new_feeds, status: state.status, url: state.url };

    if (state.edit) {
      return await axios
        .put(URL_RSS + "/" + state.id, form_data, {
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
        URL_RSS + "/" + state.id,
        {
          headers: this.getters["authentication/getHeader"](),
        }
      )
      .then((response) => {


        ///Remove all news of this rss


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
    state.title = data.title;
    state.max_new_feeds = data.max_new_feeds;
    state.status = data.status;
    state.url = data.url;
    state.edit = true;
  },

  GETALL: (state, data) => {
    state.rss = data.rss;
  },
  ADDED: () => {

  },
  REMOVED: () => {

  },
  INSERTED: (state) => {
    state.id = null;
    state.title = "";
    state.max_new_feeds = 10;
    state.status = true;
    state.url = "";
    state.edit = false;
  },

  UPDAETED: (state) => {
    state.id = null;
    state.title = "";
    state.max_new_feeds = 10;
    state.status = true;
    state.url = "";
    state.edit = false;
  },
 
  DELETED: () => {
    state.id = null;
    state.title = "";
    state.max_new_feeds = 10;
    state.status = true;
    state.url = "";
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
