<template>
  <div>
    <v-navigation-drawer
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      right
      dark
      absolute
      temporary
      v-model="drawer"
    >
      <v-list>
        <v-list-item
          :to="{ path: item.link }"
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

  
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout()" block> خروج از حساب کاربری </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-fab-transition>
      <v-btn
        v-show="drawer"
        color="primary"
        dark
        absolute
        bottom
        right
        fab
        @click.stop="changeDrawer()"
        style="margin-bottom: 35px; margin-right: 256px"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-fab-transition>
      <v-btn
        v-show="!drawer"
        color="blue"
        dark
        absolute
        fixed
        top
        right
        fab
        @click.stop="changeDrawer()"
        style="top: 74px;    position: fixed;"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: 'MenuComponent',
  data() {
    return {
      drawer: true,
      items: [
        { title: "پیشخوان", icon: "mdi-view-dashboard", link: "/" },
        { title: "اخبار", icon: "mdi-newspaper-variant-multiple", link: "/news" },
        { title: "فید خبری", icon: "mdi-newspaper-variant-multiple", link: "/feed" },
      ],
    };
  },
    mounted() {

      this.getUser().then((res)=>{
        if(res.roles.includes("admin")){
            this.items.push({ title: "رسانه ها", icon: "mdi-multimedia", link: "/media" })
            this.items.push({ title: "خبرخوان", icon: "mdi-multimedia", link: "/rss" })
        }
      });

    },
  methods: {
    changeDrawer() {
      this.drawer = !this.drawer;
     // this.$emit("changedrawerparent", this.drawer);
    },

    ...mapActions("authentication", {
      logout: "logout",
      getUser: "getProfile",
    }),


  },
};
</script>
<style >
.v-list-item .v-list-item__title,
.v-list-item .v-list-item__subtitle {
  line-height: 2.2 !important;
}
</style>