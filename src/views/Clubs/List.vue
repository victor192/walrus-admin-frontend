<template>
  <v-card class="d-flex flex-column" :loading="isLoading">
    <v-data-table
      :headers="clubsHeaders"
      :items="clubsList"
      :options.sync="clubsOptions"
      :server-items-length="clubsTotal"
      :items-per-page="clubsLimit"
    >
      <template #item.name="{ item }">
        <router-link :to="clubLink(item.id)">{{ item.name }}</router-link>
      </template>
    </v-data-table>
    <v-btn color="green" dark fixed bottom right fab>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-snackbar v-model="isFetchError">
      Ошибка при загрузке данных клубов
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { clubsMapper } from "@/store/modules/clubs";

export default Vue.extend({
  name: "ClubsList",
  data() {
    return {
      currentPage: 1,
      isLoading: true,
      isFetchError: false,
      clubsOptions: {},
      clubsHeaders: [
        {
          text: "Название клуба",
          sortable: true,
          value: "name"
        },
        {
          text: "Местоположение",
          sortable: true,
          value: "location"
        },
        {
          text: "Число участников",
          sortable: true,
          value: "members_count"
        }
      ]
    };
  },
  watch: {
    clubsOptions: {
      handler(val) {
        const { page, itemsPerPage: limit } = val;
        const offset = (page - 1) * limit;

        this.fetchClubsList(limit, offset);
      },
      deep: true
    }
  },
  computed: {
    ...clubsMapper.mapGetters(["isClubs"]),
    ...clubsMapper.mapState({
      clubsList: state => state.list,
      clubsLimit: state => state.limit,
      clubsOffset: state => state.offset,
      clubsTotal: state => state.total
    })
  },
  methods: {
    ...clubsMapper.mapActions(["setClubs"]),
    async fetchClubsList(
      this: any,
      limit: number = this.clubsLimit,
      offset: number = this.clubsOffset
    ) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        await this.setClubs({ limit, offset });
        this.isLoading = false;
      } catch (error) {
        this.isFetchError = true;
      }
    },
    clubLink(id: number) {
      return { name: "clubs-club", params: { id } };
    }
  },
});
</script>
