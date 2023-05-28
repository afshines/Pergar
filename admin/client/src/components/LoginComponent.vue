<template>
  <v-container>
    <v-row no-gutters class="text-center">
      <v-col cols="12" sm="12" md="6">
        <v-card class="pa-6" style="margin-top: 50px">
          <v-img
            style="
              margin: 0 auto;
              margin-top: 20px !important;
              margin-bottom: 20px;
            "
            width="84px"
            contain
            :src="require('../assets/logo.jpg')"
          />

          <v-form ref="form">
            <v-divider></v-divider>

            <v-text-field
              v-model="mobile"
              class="center"
              v-validate="'required|numeric'"
              :error-messages="errors.collect('mobile')"
              placeholder="موبایل"
              data-vv-name="mobile"
              required
            ></v-text-field>

            <v-text-field
              type="code"
              v-model="code"
              class="center"
              v-validate="'required|numeric'"
              :error-messages="errors.collect('code')"
              placeholder="کد"
              data-vv-name="code"
              required
            ></v-text-field>

            <v-btn
              style="margin: 15px"
              class="login-btn secondary"
              @click="submit"
              >ورود</v-btn
            >
        
            <v-divider></v-divider>

        
            <v-alert v-if="infoLogin.AuthError" type="error">
              خطا   
            </v-alert>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" class="text-center">
          <v-img
          style="margin: 0 auto; margin-top: 50px !important"
          width="70%"
          contain
          :src="require('../assets/logo.jpg')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Vue from "vue";
import VeeValidate from "vee-validate";
import farsi from "vee-validate/dist/locale/fa";
import { mapActions, mapGetters } from "vuex";
import { createHelpers } from "vuex-map-fields";
Vue.use(VeeValidate);

const { mapFields } = createHelpers({
  getterType: "authentication/getField",
  mutationType: "authentication/updateField",
});

export default {
  name: 'LoginComponent',
  $_veeValidate: {
    validator: "new",
  },

  mounted() {
    this.$validator.localize("fa", {
      messages: farsi.messages,
      attributes: {
        mobile: "موبایل",
        code: "کد",
      },
    });
  },

  computed: {
    ...mapGetters("authentication", {
      infoLogin: "infoLogin",
    }),
    ...mapFields({
      mobile: "mobile",
      code: "code",
    }),
  },

  methods: {
    ...mapActions("authentication", {
      signin: "signin",
      _showRegisterForm: "_showRegisterForm",
      _showResetForm: "_showResetForm",
    }),

    submit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let data = {
            mobile: this.mobile,
            code: this.code,
          };

          this.signin(data);
        }
      });
    },


    clear() {
      this.$validator.reset();
    },

    gotoRegister() {
      this._showRegisterForm();
    },
  },

  data: () => ({}),
};
</script>