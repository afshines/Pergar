<template>
  <v-container>
    <menu-component />

    <v-row class="text-center">
      <v-col cols="12">
        <v-card :style="{
          padding: '20px',
        }" elevation="2">
          <h3 style="text-align: right; color: #888888; padding: 5px">
            <v-icon>mdi-newspaper-variant-multiple</v-icon>
            اخبار
          </h3>

          <v-divider style="margin: 15px"></v-divider>
          <v-form ref="form">
            <v-row class="text-center">

              <v-col cols="6">
                <v-row class="text-center">
                  <v-col cols="2">
                    <span style="direction: rtl; text-align: right">* رسانه</span>
                  </v-col>
                  <v-col cols="7">
                    <v-select @change="select()" style="direction: rtl; text-align: right"
                      :error-messages="errors.collect('media_id')" v-validate="''" v-model="media_id" placeholder="رسانه"
                      data-vv-name="media_id" item-value="_id" item-text="name" :items="Media" label="رسانه"></v-select>
                  </v-col>
                  <v-col cols="3">
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="6">
                <v-row class="text-center">
                  <v-col cols="2">
                    <span style="direction: rtl; text-align: right"> موقعیت</span>
                  </v-col>
                  <v-col cols="7">
                    <v-select style="direction: rtl;  text-align: right" v-model="location_selected" placeholder="موقعیت"
                      data-vv-name="location" item-value="_id" return-object v-validate="''" item-text="title"
                      :error-messages="errors.collect('location')" :items="locations" label="موقعیت"></v-select>
                  </v-col>
                  <v-col cols="3">
                  </v-col>
                </v-row>
              </v-col>


              <v-col cols="12">


                <v-card class="mx-auto" max-width="500">
                  <v-toolbar color="primary" dark>
                    <v-app-bar-nav-icon></v-app-bar-nav-icon>


                    <v-select style="max-width: 300px;direction: rtl; text-align: right"
                      :error-messages="errors.collect('rss_id')" v-validate="''" v-model="selectedRssItem"
                      placeholder="خبرخوان" data-vv-name="rss_id" item-value="_id" item-text="title" :items="Rss"
                      label="خبرخوان">


                      <template v-slot:item="{ item }">
                        <div class="truncate">{{ truncateText(item) }}</div>
                      </template>
                    </v-select>

                    <v-text-field style="direction: rtl; text-align: right" v-model="limit"
                      placeholder="تعداد"></v-text-field>

                    <v-btn @click="add_location()" icon>
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-btn>

                  </v-toolbar>

                  <v-list two-line>
                    <v-list-item-group v-if="location_selected != null && location_selected.rss != undefined">
                      <template v-for="(item, index) in location_selected.rss">
                        <v-list-item :key="item._id">

                          <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                            <v-list-item-subtitle>تعداد : {{ item.limit }}</v-list-item-subtitle>

                          </v-list-item-content>

                          <v-list-item-action>

                            <v-btn @click="remove_rss(index)" icon>
                              <v-icon color="grey lighten-1">
                                mdi-close
                              </v-icon>
                            </v-btn>



                          </v-list-item-action>

                        </v-list-item>

                        <v-divider v-if="index < location_selected.rss.length - 1" :key="index"></v-divider>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-card>


              </v-col>

            </v-row>





          </v-form>


        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Vue from "vue";
import VeeValidate from "vee-validate";
import MenuComponent from "./MenuComponent.vue";
import farsi from "vee-validate/dist/locale/fa";
import { mapActions, mapGetters } from "vuex";
import { createHelpers } from "vuex-map-fields";


Vue.use(VeeValidate);

const { mapFields } = createHelpers({
  getterType: "rss/getField",
  mutationType: "rss/updateField",
});


export default {
  name: 'FeedComponent',
  $_veeValidate: {
    validator: "new",
  },
  components: {
    "menu-component": MenuComponent,

  },

  computed: {

    ...mapGetters("media", {
      Media: "Media",
    }),

    ...mapGetters("rss", {
      Rss: "Rss",
    }),

    ...mapFields({
      title: "title",
      edit: "id",
      id: "id",
    }),
  },

  data() {
    return {
      limit: 3,
      locations: [],
      loading: false,
      selectedRssItem: null,
      timer: null,
      location_selected: null,
      media_id: null,
    };
  },

  mounted() {


    this.loading = true;

    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case "rss/ADDED":
          this.loading = true;
          this.getAll().then(() => {
            this.select(false);
          });

          break;

        case "rss/REMOVED":
          this.loading = true;
          this.getAll().then(() => {
            this.select(false);
          });

          break;
      }
    });

    this.$validator.localize("fa", {
      messages: farsi.messages,
      attributes: {

      },
    });

    // this.do_search();

    this.getAll().then(() => {

    });

    this.getRss().then(() => {

    });



    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

  },

  watch: {


    Pagination: {
      handler() {
        this.loading = true;
        // this.do_search();
      },
      deep: true,
    },
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {

    add_location() {
      if (
        this.location_selected != null &&
        this.media_id != null &&
        this.selectedRssItem != null &&
        this.limit > 0
      ) {
        this.addToLocation({ location_selected: this.location_selected._id, media_id: this.media_id, selectedRssItem: this.selectedRssItem, limit: this.limit });
      }

    },
    remove_rss(index) {

      if (
        this.location_selected != null &&
        this.media_id != null
      ) {
        this.removeLoc({ location_selected: this.location_selected._id, media_id: this.media_id, selectedRssItem: this.location_selected.rss[index]._id });
      }

    },
    truncateText(item) {
      return item.title.length > 20 ? item.title.slice(0, 20) + '...' : item.title;
    },
    async _deleteFromMedia() {
      await this.deleteFromMedia();
      this.location_selected = null;
    },

    async _addToLocations() {
      await this.deleteFromMedia();
      await this.addToLocation();

    },
    _deleteAll() {

      var r = confirm(
        "در صورت حذف کل اطلاعات مربوط به این موارد برای همیشه حذف میشود آیا اطمینان دارید ؟"
      );
      if (r == true) {
        this.deleteAll();
      }


    },


    async select(reset = true) {
      this.loading = true;
      if (reset)
        this.location_selected = null;
      var index = this.Media.map(item => item._id).indexOf(this.media_id);  // this.Media.findIndex(item => item._id==this.media_id);  //

      this.locations = this.Media[index].locations;

      if (!reset) {

        var that = this;



        this.location_selected = this.locations.filter(i => {
          return i._id == that.location_selected._id
        })[0];
      }

      this.loading = false;
    },





    _delete() {
      var r = confirm(
        "در صورت حذف کل اطلاعات مربوط به این مورد برای همیشه حذف میشود آیا اطمینان دارید ؟"
      );
      if (r == true) {
        this.__delete();
      }
    },

    ...mapActions("rss", {
      removeLoc: "removeLoc",
      addToLocation: "addToLoc",
    }),

    ...mapActions("rss", {
      getRss: "getAll",
    }),

    ...mapActions("media", {
      getAll: "getAll",

    }),

    onResize() {
      this.windowWidth = window.innerWidth;
    },




  },
};
</script>
<style>
.v-list-item .v-list-item__title,
.v-list-item .v-list-item__subtitle {
  line-height: 2.2 !important;
}
</style>

