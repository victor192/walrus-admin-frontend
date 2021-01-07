<template>
  <div class="d-flex flex-column">
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
    <div class="text-h5 font-weight-bold mb-4">Участники клуба</div>
    <v-card :loading="isLoading">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                ФИО
              </th>
              <th class="text-center">
                Пол
              </th>
              <th class="text-center">
                Возраст
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>
                <router-link :to="memberLink(member.id)">
                  {{
                    getFullName(
                      member.last_name,
                      member.first_name,
                      member.middle_name
                    )
                  }}
                </router-link>
              </td>
              <td class="text-center">
                {{ getGenderName(member.gender) }}
              </td>
              <td class="text-center">
                {{ getAgeFromBirthdate(member.birthdate) }}
              </td>
            </tr>
            <tr v-if="isEmptymembers">
              <td colspan="3" class="text-center">
                Участников в клубе нет
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-snackbar v-model="isFetchError">
      Ошибка при загрузке данных клуба
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Clubs, Members } from "@/api";
import {
  getFullName,
  getGenderName,
  getAgeFromBirthdate
} from "@/utils/filters";

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
  computed: {
    isEmptymembers(this: any) {
      return this.members.length === 0;
    }
  },
  mounted() {
    this.fetchClub(this.$route.params.id);
  },
  methods: {
    getFullName,
    getGenderName,
    getAgeFromBirthdate,
    async fetchClub(id: string) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        const response = await Promise.all([
          Clubs.getClub(id),
          Members.getList(-1, 0, "last_name", "desc", Number(id))
        ]);

        const { status: clubStatus, data: clubData } = response[0];
        const { status: membersStatus, data: membersData } = response[1];

        if (clubStatus === 200 && membersStatus === 200) {
          const { data: club } = clubData;
          const { data: members } = membersData;
          const { name, location } = club;

          this.name = name;
          this.location = location;
          this.members = members;
          this.isLoading = false;
        }
      } catch (error) {
        this.isFetchError = true;
      }
    },
    memberLink(id: number) {
      return { name: "members-member", params: { id } };
    }
  }
});
</script>
