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

              <v-col cols="6" v-if="edit">
                <v-row class="text-center">
                  <v-col cols="2">
                    <span style="direction: rtl; text-align: right">* رسانه</span>
                  </v-col>
                  <v-col cols="7">
                    <v-select @change="select()" style="direction: rtl; text-align: right"
                      :error-messages="errors.collect('media_id')" v-validate="''" v-model="media_id"
                      placeholder="رسانه" data-vv-name="media_id" item-value="_id" item-text="name" :items="Media"
                      label="رسانه"></v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-btn v-show="edit" :disabled="loading" class="error btn" @click="_deleteFromMedia()">حذف</v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="6" v-if="edit">
                <v-row class="text-center">
                  <v-col cols="2">
                    <span style="direction: rtl; text-align: right"> موقعیت</span>
                  </v-col>
                  <v-col cols="7">
                    <v-select style="direction: rtl;  text-align: right" v-model="locations_selected"
                      placeholder="موقعیت" multiple data-vv-name="location" return-object v-validate="''"
                      item-text="title" :error-messages="errors.collect('location')" :items="locations"
                      label="موقعیت"></v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-btn v-show="edit" :disabled="loading" class="primary btn"
                      @click="_addToLocations()">بروزرسانی</v-btn>

                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* عنوان</span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required|max:255'"
                      v-model="title" :error-messages="errors.collect('title')" placeholder="عنوان" data-vv-name="title"
                      required></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* آدرس خبر</span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required'" v-model="url"
                      :error-messages="errors.collect('url')" placeholder="آدرس خبر" data-vv-name="url"
                      required></v-text-field>
                  </v-col>
                </v-row>

              </v-col>


              <v-col cols="6">

                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">وضعیت</span>
                  </v-col>
                  <v-col cols="8">
                    <v-checkbox v-model="status"></v-checkbox>
                  </v-col>
                </v-row>

              </v-col>








            </v-row>


            <v-row class="text-center">
              <v-col cols="6">
                <v-btn v-show="!edit" :disabled="loading" class="success btn" @click="_save()">افزودن</v-btn>

                <v-btn v-show="edit" :disabled="loading" class="primary btn" @click="__update()">بروزرسانی</v-btn>

                <v-btn style="margin:5px" v-show="edit" :disabled="loading" class="error btn" @click="clear">ثبت
                  جدید</v-btn>
              </v-col>
              <v-col cols="6">


                <v-btn v-show="edit" :disabled="loading" class="error btn" @click="_delete()">حذف</v-btn>
              </v-col>
            </v-row>

          </v-form>
          <v-divider style="margin: 15px"></v-divider>

          <v-row class="text-center">



            <v-col cols="12">



              <v-data-table :loading="loading" loading-text="درحال دریافت اطلاعات..." :headers="TableData.headers"
                show-select unselectable item-key="_id" v-model="selected" :items="TableData.data" style="padding: 15px"
                class="elevation-1" :server-items-length="TableData.total" :options.sync="TableData.pagination"
                :footer-props="{
                  'items-per-page-options': [5, 15, 25, 50, 100],
                }">

                <template v-slot:top>
                  <v-row class="text-center">
                    <v-col cols="3">
                      <v-btn class="primary btn" @click="_search()">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field v-model="search" label="جستجو با عنوان" single-line hide-details></v-text-field>
                    </v-col>

                    <v-col cols="2">
                      <v-select style="direction: rtl; text-align: right" v-model="media_id_search" placeholder="رسانه"
                        item-value="_id" item-text="name" :items="[{_id:null,name:'همه'} ,...Media]" label="رسانه"></v-select>
                    </v-col>

                    <v-col cols="2">
                      <v-btn class="primary btn" @click="refresh_search()">
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-btn class="error btn" @click="_deleteAll()">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:item._id="{ item }">
                  {{ TableData.data.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.actions="{ item }">


                  <v-icon small class="mr-2" @click="_edit(item)"> mdi-pen </v-icon>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-simple-checkbox v-model="item.status" disabled></v-simple-checkbox>
                </template>

                <template v-slot:item.location="{ item }">
                  {{ item.location.title }}

                </template>

                <template v-slot:item.media="{ item }">
                  
                  {{ JSON.stringify(item.media) }}

                </template>

              </v-data-table>


            </v-col>
          </v-row>

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
  getterType: "news/getField",
  mutationType: "news/updateField",
});


export default {
  name: 'NewsComponent',
  $_veeValidate: {
    validator: "new",
  },
  components: {
    "menu-component": MenuComponent,

  },

  computed: {
    ...mapGetters("news", {
      TableData: "TableData",
      Pagination: "Pagination",
    }),

    ...mapGetters("media", {
      Media: "Media",
    }),

    ...mapFields({
      title: "title",
      edit: "id",
      id: "id",

      status: "status",
      url: "url",
      media_id: "media_id",
      locations_selected: "locations_selected",
      selected: "selected",
    }),
  },

  data() {
    return {
      media_id_search: null,
      locations: [],
      loading: false,
      search: "",
      timer: null,
    };
  },

  mounted() {


    this.loading = true;

    this.$store.subscribe((mutation) => {
      switch (mutation.type) {


        case "news/INSERTED":
          this.loading = true;
          this.search = "";
          this.do_search({ title: "", media_id: this.media_id_search });
          break;

        case "news/UPDAETED":
          this.loading = true;
          this.search = "";
          this.do_search({ title: "", media_id: this.media_id_search });
          break;


        case "news/GETONE":
          this.loading = false;

          break;

        case "news/GETSEARCH":
          this.loading = false;

          break;
        case "news/DELETED":
          this.loading = true;
          this.search = "";
          this.do_search({ title: "", media_id: this.media_id_search });

          break;

      }
    });

    this.$validator.localize("fa", {
      messages: farsi.messages,
      attributes: {
        title: "عنوان",
        url: "آدرس خبر",
        media_id: "رسانه",
        location: "موقعیت",
      },
    });

    this.do_search({ title: "", media_id: this.media_id_search });

    this.getAll().then(() => {
      //if (this.media_id !== null)
       // this.select()
    });

    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

  },

  watch: {


    Pagination: {
      handler() {
        this.loading = true;
        this.do_search({ title: this.search, media_id: this.media_id_search });
      },
      deep: true,
    },
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {

    async _deleteFromMedia() {
      await this.deleteFromMedia();
      this.locations_selected = [];
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
    _search() {
      this.do_search({ title: this.search, media_id: this.media_id_search });
    },
    refresh_search() {
      this.search = "";
      this.media_id_search = null;
      this._search();
    },

    async select() {
      this.loading = true ;
      this.locations_selected =[];
      var index = this.Media.map(item => item._id).indexOf(this.media_id);  // this.Media.findIndex(item => item._id==this.media_id);  //

      this.locations = this.Media[index].locations;

      if(this.edit){
       let media = await this.getLocations();
   
       if(media!= null && media.length != 0){

        let locations = [];

        await media[0].locations.map(async (location)=>{
          let filters = await location.news.filter(a => a._id == this.id);
          if(filters.length > 0){
            await locations.push(location);
          }
        })

        this.locations_selected =  locations;

       }
      }
        

      this.loading = false ;
    },

    _edit(item) {
      this.loading = true;
      this.getOne(item._id);
    },

    _delete() {
      var r = confirm(
        "در صورت حذف کل اطلاعات مربوط به این مورد برای همیشه حذف میشود آیا اطمینان دارید ؟"
      );
      if (r == true) {
        this.__delete();
      }
    },

    ...mapActions("news", {
      do_search: "search",
      insert: "insert",
      __delete: "delete",
      update: "update",
      getOne: "getOne",
      clear: "clear",
      deleteAll: "deleteAll",
      deleteFromMedia: "deleteFromMedia",
      getLocations: "getLocations",
      addToLocation: "addToLocation",
    }),

    ...mapActions("media", {
      getAll: "getAll",
    }),

    onResize() {
      this.windowWidth = window.innerWidth;
    },

    _save() {
      this.$validator.validate().then((result) => {
        if (result) {
          this.insert();
        }
      });
    },

    __update() {
      this.$validator.validate().then((result) => {
        if (result) {
          this.update();
        }
      });
    }


  },
};
</script>
<style>
.v-list-item .v-list-item__title,
.v-list-item .v-list-item__subtitle {
  line-height: 2.2 !important;
}
</style>

