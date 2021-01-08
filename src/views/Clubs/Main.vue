<template>
  <div class="d-flex flex-column align-content-start">
    <div class="d-flex justify-space-between mb-4">
      <div class="text-h5 font-weight-bold">{{ $route.meta.title }}</div>
      <v-btn
        v-if="$route.meta.backLink"
        class="font-weight-bold"
        to="/clubs/list"
        link
      >
        Назад
      </v-btn>
    </div>
    <router-view />
  </div>
</template>
