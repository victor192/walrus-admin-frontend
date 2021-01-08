<template>
  <v-navigation-drawer width="300px" app>
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar width="100%" height="100%">
          <img src="@/assets/images/logo.svg" />
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item>
        <v-list-group prepend-icon="mdi-account-multiple-outline">
          <template #activator>
            <v-list-item-title>Клубы моржей</v-list-item-title>
          </template>
          <v-list-item to="/clubs/list" link>Список клубов</v-list-item>
          <v-list-item to="/members/list" link>Участники</v-list-item>
        </v-list-group>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Sidebar"
});
</script>
