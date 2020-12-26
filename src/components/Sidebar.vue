<template>
  <v-navigation-drawer app>
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar width="100%" height="100%">
          <img src="@/assets/images/logo.svg"/>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Sidebar'
  })
</script>