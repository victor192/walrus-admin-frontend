<template>
  <v-app>
    <sidebar v-model="drawer" />
    <navbar v-model="drawer" />
    <v-main>
      <v-container class="text-left" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

export default Vue.extend({
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      drawer: true
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
