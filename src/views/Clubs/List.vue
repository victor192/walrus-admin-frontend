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
    <create-club />
    <v-snackbar v-model="isCreatedNewClub" color="green">
      Клуб успешно создан
    </v-snackbar>
    <v-snackbar v-model="isFetchError">
      Ошибка при загрузке данных клубов
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { clubsMapper } from "@/store/modules/clubs";
import CreateClub from "./List/Create.vue";

export default Vue.extend({
  name: "ClubsList",
  components: { CreateClub },
  data() {
    return {
      currentPage: 1,
      isLoading: true,
      isFetchError: false,
      isCreatedNewClub: false,
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
        const { page, itemsPerPage: limit, sortBy, sortDesc } = val;
        const offset = (page - 1) * limit;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          const sort = sortBy[0];
          const direction = sortDesc[0] ? "desc" : "asc";

          this.setSort({ sort, direction });
        }

        this.fetchClubsList(limit, offset);
      },
      deep: true
    }
  },
  mounted() {
    this.$root.$on("onCreatedNewClub", this.handleCreateClub);
  },
  computed: {
    ...clubsMapper.mapGetters(["isClubs"]),
    ...clubsMapper.mapState({
      clubsList: state => state.list,
      clubsLimit: state => state.limit,
      clubsOffset: state => state.offset,
      clubsTotal: state => state.total,
      clubsSort: state => state.sort,
      clubsDirection: state => state.direction
    })
  },
  methods: {
    ...clubsMapper.mapActions(["setClubs", "setSort"]),
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
    },
    async handleCreateClub() {
      this.isCreatedNewClub = true;

      await this.fetchClubsList();
    }
  }
});
</script>
