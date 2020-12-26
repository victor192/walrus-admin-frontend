<template>
  <div class="d-flex flex-column" :loading="isLoading">
    <v-card :loading="isLoading" class="mb-4">
      <v-simple-table>
        <tbody>
        <tr>
          <td>Название</td>
          <td class="font-weight-bold">{{ name }}</td>
        </tr>
        <tr>
          <td>Расположение</td>
          <td class="font-weight-bold">{{ location }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    <div class="text-h5 font-weight-bold">Участники клуба</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Clubs } from "@/api";

export default Vue.extend({
  name: "ClubsClub",
  data() {
    return {
      name: "",
      location: "",
      members: [],
      isLoading: true,
      isFetchError: false
    };
  },
  mounted() {
    this.fetchClub(this.$route.params.id);
  },
  methods: {
    async fetchClub(id: string) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        const { status, data } = await Clubs.getClub(id);

        if (status === 200) {
          const { data: club } = data;
          const { name, location } = club;

          this.name = name;
          this.location = location;
          this.isLoading = false;
        }
      } catch (error) {
        this.isFetchError = true;
      }
    }
  }
});
</script>
