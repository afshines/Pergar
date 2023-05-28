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
            خبرخوان
          </h3>

          <v-divider style="margin: 15px"></v-divider>
          <v-form ref="form">
            <v-row class="text-center">

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* عنوان</span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required|max:125'" v-model="title"
                      :error-messages="errors.collect('title')" placeholder="عنوان" data-vv-name="title"
                      required></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* آدرس </span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required|url'" v-model="url"
                      :error-messages="errors.collect('url')" placeholder="آدرس " data-vv-name="url"
                      required></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

              <v-col cols="6">


                <v-row class="text-center">
                  <v-col cols="4">
                    <span style="direction: rtl; text-align: right">* تعداد </span>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field style="direction: rtl; text-align: right" v-validate="'required|numeric'"
                      v-model="max_new_feeds" :error-messages="errors.collect('max_new_feeds')" placeholder="تعداد "
                      data-vv-name="max_new_feeds" required></v-text-field>
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
                :items="TableData.data" style="padding: 15px" class="elevation-1" :server-items-length="TableData.total"
                :options.sync="TableData.pagination" :footer-props="{
                  'items-per-page-options': [5, 15, 25, 50, 100],
                }">

                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="_edit(item)"> mdi-pen </v-icon>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-simple-checkbox v-model="item.status" disabled></v-simple-checkbox>
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
  getterType: "rss/getField",
  mutationType: "rss/updateField",
});


export default {
  name: 'RssComponent',
  $_veeValidate: {
    validator: "new",
  },
  components: {
    "menu-component": MenuComponent,

  },

  computed: {
    ...mapGetters("rss", {
      TableData: "TableData",
      Pagination: "Pagination",
    }),

    ...mapFields({
      title: "title",
     
      edit: "id",
      id: "id",
     
      status: "status",
      url: "url",
      max_new_feeds: "max_new_feeds",
    }),
  },

  data() {
    return {

      loading: false,
    
      timer: null

    };
  },

  mounted() {


    this.loading = true;

    this.$store.subscribe((mutation) => {
      switch (mutation.type) {


        case "rss/INSERTED":
          this.loading = true;
          this.search = "";
          this.load_list();
          break;

        case "rss/UPDAETED":
          this.loading = true;
          this.search = "";
          this.load_list();
          break;


        case "rss/GETONE":
          this.loading = false;

          break;

        case "rss/GETSEARCH":
          this.loading = false;

          break;
        case "rss/DELETED":
          this.loading = true;
          this.search = "";
          this.load_list();

          break;

      }
    });

    this.$validator.localize("fa", {
      messages: farsi.messages,
      attributes: {
        title: "نام",
        url: "آدرس ",
        max_new_feeds: "آدرس ",
      },
    });

    this.load_list();

    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

  },

  watch: {

    Pagination: {
      handler() {
        this.loading = true;
        this.load_list();
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
      this._search();
    },
    _search() {
      this.load_list();
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

    ...mapActions("rss", {
      load_list: "search",
      insert: "insert",
      __delete: "delete",
      update: "update",
      getOne: "getOne",
      clear: "clear",
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
