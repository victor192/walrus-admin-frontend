<template>
  <div class="d-flex flex-column">
    <v-card :loading="isLoading" class="mb-4">
      <v-chip v-if="isParaSwimmer" class="ma-2" color="primary" label>
        Участник является параплавцом
      </v-chip>
      <v-simple-table>
        <tbody>
          <tr>
            <td>Фамилия</td>
            <td class="font-weight-bold">{{ lastName }}</td>
          </tr>
          <tr>
            <td>Имя</td>
            <td class="font-weight-bold">{{ firstName }}</td>
          </tr>
          <tr v-if="middleName">
            <td>Отчество</td>
            <td class="font-weight-bold">{{ middleName }}</td>
          </tr>
          <tr>
            <td>Клуб</td>
            <td class="font-weight-bold">
              <router-link :to="clubLink">{{ club.name }}</router-link>
            </td>
          </tr>
          <tr>
            <td>Пол</td>
            <td class="font-weight-bold">{{ getGenderName(gender) }}</td>
          </tr>
          <tr v-if="birthdate">
            <td>День рождения</td>
            <td class="font-weight-bold">{{ birthdate }}</td>
          </tr>
          <tr v-if="birthdate">
            <td>Возраст</td>
            <td class="font-weight-bold">
              {{ getAgeFromBirthdate(birthdate) }}
            </td>
          </tr>
          <tr v-if="email">
            <td>E-mail</td>
            <td class="font-weight-bold">{{ email }}</td>
          </tr>
          <tr v-if="phone">
            <td>Телефон</td>
            <td class="font-weight-bold">{{ phone }}</td>
          </tr>
          <tr v-if="location">
            <td>Город</td>
            <td class="font-weight-bold">{{ location }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    <v-snackbar v-model="isFetchError">
      Ошибка при загрузке данных участника
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Members } from "@/api";
import { getGenderName, getAgeFromBirthdate } from "@/utils/filters";

export default Vue.extend({
  name: "MembersMember",
  data() {
    return {
      firstName: "",
      lastName: "",
      middleName: null,
      club: {
        id: -1,
        name: ""
      },
      gender: "male",
      isParaSwimmer: false,
      birthdate: null,
      email: null,
      phone: null,
      location: null,
      isLoading: true,
      isFetchError: false
    };
  },
  computed: {
    clubLink(this: any) {
      return { name: "clubs-club", params: { id: this.club.id } };
    }
  },
  mounted() {
    this.fetchMember(this.$route.params.id);
  },
  methods: {
    getGenderName,
    getAgeFromBirthdate,
    async fetchMember(id: string) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        const { status, data: memberData } = await Members.getMember(id);

        if (status === 200) {
          const { data: member } = memberData;

          this.firstName = member.first_name;
          this.lastName = member.last_name;
          this.middleName = member.middle_name;
          this.club.id = member.club.id;
          this.club.name = member.club.name;
          this.gender = member.gender;
          this.isParaSwimmer = member.para_swimmer;
          this.birthdate = member.birthdate;
          this.email = member.email;
          this.phone = member.phone;
          this.location = member.location;
          this.isLoading = false;
        }
      } catch (error) {
        this.isFetchError = true;
      }
    }
  }
});
</script>
