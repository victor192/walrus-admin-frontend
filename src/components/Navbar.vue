<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="$emit('change', !drawer)"></v-app-bar-nav-icon>
    <v-toolbar-title>Система управления соревнованиями</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
          color="primary white--text"
          class="font-weight-bold"
          size="45"
          v-on="on"
          v-bind="attrs"
        >
          {{ profileName }}
        </v-avatar>
      </template>
      <v-list>
        <v-list-item link @click="logout">Выйти из системы</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Navbar",
  model: {
    prop: "drawer",
    event: "change"
  },
  props: {
    drawer: Boolean
  },
  computed: {
    profileName() {
      return this.$store.getters["profile/name"].substring(0, 2).toUpperCase();
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");

      window.location.reload();
    }
  }
});
</script>
