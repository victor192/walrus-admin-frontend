<template>
  <div class="d-flex flex-column">
    <v-card :loading="isLoading" class="mb-4">
      <v-chip v-if="isParaSwimmer" class="ma-2" color="primary" label>
        Участник является параплавцом
      </v-chip>
      <v-simple-table>
        <tbody>
          <tr>
            <td>Соревнование</td>
            <td class="font-weight-bold">{{ competition.name }}</td>
          </tr>
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
          <tr>
            <td>Клуб</td>
            <td class="font-weight-bold">{{ clubName }}</td>
          </tr>
          <tr>
            <td>Город</td>
            <td class="font-weight-bold">{{ location }}</td>
          </tr>
          <tr v-if="email">
            <td>E-mail</td>
            <td class="font-weight-bold">{{ email }}</td>
          </tr>
          <tr v-if="phone">
            <td>Телефон</td>
            <td class="font-weight-bold">{{ phone }}</td>
          </tr>
          <tr v-if="createdAt">
            <td>Дата создания</td>
            <td class="font-weight-bold">{{ formattedDateTime(createdAt) }}</td>
          </tr>
          <tr>
            <td>Статус</td>
            <td><order-status :status="status" /></td>
          </tr>
          <tr v-if="additional">
            <td>Дополнительная информация</td>
            <td>
              <v-textarea
                filled
                disabled
                :value="additional"
                class="mt-4"
              ></v-textarea>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Orders } from "@/api";
import { getGenderName, getAgeFromBirthdate } from "@/utils/filters";
import { formattedDateTime } from "@/utils/time";
import OrderStatus from "./Common/Status.vue";

export default Vue.extend({
  name: "OrdersOrder",
  components: {
    OrderStatus
  },
  data() {
    return {
      competition: {
        id: null,
        name: ""
      },
      firstName: "",
      lastName: "",
      middleName: null,
      gender: "male",
      birthdate: null,
      isParaSwimmer: false,
      clubName: "",
      location: "",
      email: null,
      phone: null,
      createdAt: null,
      status: "new",
      additional: null,
      isLoading: true,
      isFetchError: false
    };
  },
  mounted() {
    this.fetchOrder(this.$route.params.id);
  },
  methods: {
    getGenderName,
    getAgeFromBirthdate,
    formattedDateTime,
    async fetchOrder(id: string) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        const { status, data: orderData } = await Orders.getOrder(id);

        if (status === 200) {
          const { data: order } = orderData;

          this.competition.id = order.competition.id;
          this.competition.name = order.competition.name;
          this.firstName = order.first_name;
          this.lastName = order.last_name;
          this.middleName = order.middle_name;
          this.gender = order.gender;
          this.birthdate = order.birthdate;
          this.isParaSwimmer = order.para_swimmer;
          this.clubName = order.club_name;
          this.location = order.location;
          this.email = order.email;
          this.phone = order.phone;
          this.createdAt = order.created_at;
          this.status = order.status;
          this.additional = order.additional;
          this.isLoading = false;
        }
      } catch (error) {
        this.isFetchError = true;
      }
    }
  }
});
</script>
