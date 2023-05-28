<template>
  <v-container>
    <menu-component  />

    <v-row class="text-center">
      <v-col cols="12">
        <v-card
          :style="{
            padding: '20px',
          }"
          elevation="2"
        >
          <h3 style="text-align: right; color: #888888; padding: 5px">
            <v-icon>mdi-view-dashboard</v-icon>
            پیشخوان
          </h3>

          <v-divider style="margin: 15px"></v-divider>

 
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import MenuComponent from "./MenuComponent.vue";

export default {
  name: 'HomeComponent',

  components: {
    "menu-component" :MenuComponent,
   
  },
  data() {
    return {

      loading:false,
  
    
     
    };
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
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
