<template>
  <div id="app">
    <v-app>
      <sidebar/>
      <navbar/>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Sidebar from "@/components/Sidebar.vue";
  import Navbar from "@/components/Navbar.vue";

  export default Vue.extend({
    components: {
      Sidebar,
      Navbar
    }
  })
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