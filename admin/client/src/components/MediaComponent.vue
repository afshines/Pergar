<template>
  <v-container>
    <menu-component />

    <v-row class="text-center">
      <v-col cols="12">
        <v-card :style="{
          padding: '20px',
        }" elevation="2">
          <h3 style="text-align: right; color: #888888; padding: 5px">
            <v-icon>mdi-multimedia</v-icon>
            رسانه ها
          </h3>

          <v-divider style="margin: 15px"></v-divider>
          <v-form ref="form">
            <v-row class="text-center">

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* نام</span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required|max:25'"
                      v-model="name" :error-messages="errors.collect('name')" placeholder="نام" data-vv-name="name"
                      required></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* آدرس سایت</span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required|url'" v-model="domain"
                      :error-messages="errors.collect('domain')" placeholder="آدرس سایت" data-vv-name="domain"
                      required></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

              <v-col cols="6">
                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">آدرس آیکون</span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-model="icon"
                      placeholder="آدرس آیکون"></v-text-field>
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


              <v-col cols="12">


                <v-card class="mx-auto" max-width="500">
                  <v-toolbar color="primary" dark>
                    <v-app-bar-nav-icon></v-app-bar-nav-icon>


                    <v-text-field style="direction: rtl; text-align: right" v-model="title"
                      placeholder="مثال وبگردی"></v-text-field>

                    <v-text-field style="direction: rtl; text-align: right" v-model="location"
                      placeholder="مثال box_1"></v-text-field>

                    <v-btn @click="add_location()" icon>
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-btn>

                  </v-toolbar>

                  <v-list two-line>
                    <v-list-item-group>
                      <template v-for="(location, index) in locations">
                        <v-list-item :key="location.location">

                          <v-list-item-content>
                            <v-list-item-title v-text="location.title"></v-list-item-title>
                            <v-list-item-subtitle v-text="location.location"></v-list-item-subtitle>

                          </v-list-item-content>

                          <v-list-item-action>

                            <v-btn @click="remove_location(index)" icon>
                              <v-icon color="grey lighten-1">
                                mdi-close
                              </v-icon>
                            </v-btn>



                          </v-list-item-action>

                        </v-list-item>

                        <v-divider v-if="index < locations.length - 1" :key="index"></v-divider>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-card>


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
                :items="TableData.data" style="padding: 15px" class="elevation-1" :server-items-length="TableData.total"
                :options.sync="TableData.pagination" :footer-props="{
                  'items-per-page-options': [5, 15, 25, 50, 100],
                }">

                <template v-slot:top>
                  <v-row>
                    <v-col cols="4">
                      <v-btn class="primary btn" @click="_search()">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field v-model="search" label="جستجو با نام" single-line hide-details></v-text-field>

                    </v-col>



                    <v-col cols="4">
                      <v-btn class="primary btn" @click="refresh_search()">
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>


                </template>

                <template v-slot:item.actions="{ item }">


                  <v-icon small class="mr-2" @click="_edit(item)"> mdi-pen </v-icon>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-simple-checkbox v-model="item.status" disabled></v-simple-checkbox>
                </template>

                <template v-slot:item.icon="{ item }">
                  <v-img contain :src="item.icon" transition="scale-transition" width="64" />
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
  getterType: "media/getField",
  mutationType: "media/updateField",
});


export default {
  name: 'MediaComponent',
  $_veeValidate: {
    validator: "new",
  },
  components: {
    "menu-component": MenuComponent,

  },

  computed: {
    ...mapGetters("media", {
      TableData: "TableData",
      Pagination: "Pagination",
    }),

    ...mapFields({
      title: "title",
      location: "location",
      edit: "id",
      id: "id",
      name: "name",
      icon: "icon",
      status: "status",
      domain: "domain",
      locations: "locations",
    }),
  },

  data() {
    return {

      loading: false,
      search: "",
      timer: null

    };
  },

  mounted() {


    this.loading = true;

    this.$store.subscribe((mutation) => {
      switch (mutation.type) {


        case "media/INSERTED":
          this.loading = true;
          this.search = "";
          this.do_search({ name: "" });
          break;

        case "media/UPDAETED":
          this.loading = true;
          this.search = "";
          this.do_search({ name: "" });
          break;


        case "media/GETONE":
          this.loading = false;

          break;

        case "media/GETSEARCH":
          this.loading = false;

          break;
        case "media/DELETED":
          this.loading = true;
          this.search = "";
          this.do_search({ name: "" });

          break;

      }
    });

    this.$validator.localize("fa", {
      messages: farsi.messages,
      attributes: {
        name: "نام",
        domain: "آدرس سایت",

      },
    });

    this.do_search({ name: "" });

    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

  },

  watch: {

    Pagination: {
      handler() {
        this.loading = true;
        this.do_search({ name: this.search });
      },
      deep: true,
    },
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    refresh_search() {
      this.search = "";
      this._search() ;
    },
    _search() {
      this.do_search({ name: this.search });
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

    ...mapActions("media", {
      do_search: "search",
      insert: "insert",
      __delete: "delete",
      update: "update",
      getOne: "getOne",
      clear: "clear",
      add_location: "add_location",
      remove_location: "remove_location",
    }),

    onResize() {
      this.windowWidth = window.innerWidth;
    },

    _save(){
      this.$validator.validate().then((result) => {
        if (result) {
          this.insert();
        }
      });
    },

    __update(){
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
