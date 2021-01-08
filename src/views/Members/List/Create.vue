<template>
  <v-dialog v-model="dialog" max-width="500px" content-class="text-left">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" v-bind="attrs" v-on="on" dark fixed bottom right fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="font-weight-bold">
        Добавление нового участника
      </v-card-title>
      <v-card-text>
        <v-alert
          v-model="showAlert"
          border="top"
          color="red lighten-2"
          dark
          dismissible
        >
          Произошла ошибка при добавлении нового участника!
        </v-alert>
        <v-form ref="createMemberForm" v-model="valid" lazy-validation>
          <v-text-field
            v-model="lastName"
            :rules="lastNameRules"
            label="Фамилия"
            required
          />
          <v-text-field
            v-model="firstName"
            :rules="lastNameRules"
            label="Имя"
            required
          />
          <v-text-field v-model="middleName" label="Отчество" />
          <v-select
            v-model="club"
            :items="clubs"
            :rules="clubRules"
            label="Клуб"
            item-text="name"
            item-value="id"
            required
          >
            <template #item="{ item }">
              <div class="d-flex flex-column text-left my-2">
                <span class="font-weight-bold">{{ item.name }}</span>
                <span>{{ item.location }}</span>
              </div>
            </template>
          </v-select>
          <v-radio-group v-model="gender" row>
            <v-radio label="Мужчина" value="male"></v-radio>
            <v-radio label="Женщина" value="female"></v-radio>
          </v-radio-group>
          <v-menu
            v-model="birthdateMenu"
            :close-on-content-click="false"
            max-width="290"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="birthdate"
                :rules="birthdateRules"
                label="День рождения"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                readonly
                required
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="birthdate"
              @change="birthdateMenu = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
          ></v-text-field>
          <v-text-field
            v-model="phone"
            :rules="phoneRules"
            label="Телефон"
          ></v-text-field>
          <v-btn :disabled="!valid" color="success" @click="createMember">
            Создать
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Members } from "@/api";

export default Vue.extend({
  name: "CreateMember",
  props: {
    clubs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialog: false,
      valid: true,
      lastName: "",
      lastNameRules: [(v: string) => !!v || "Это обязательное поле для ввода!"],
      firstName: "",
      middleName: "",
      club: null,
      clubRules: [
        (v: number | null) => v !== null || "Необходимо указать клуб участника!"
      ],
      gender: "male",
      birthdate: null,
      birthdateMenu: false,
      birthdateRules: [
        (v: string | null) =>
          v !== null || "Необходимо указать день рождения участника!"
      ],
      email: "",
      emailRules: [
        (v: string) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return v.length > 0
            ? pattern.test(v) || "Введите корректный e-mail!"
            : true;
        }
      ],
      phone: "",
      phoneRules: [
        (v: string) => {
          // eslint-disable-next-line
          const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
          return v.length > 0
            ? pattern.test(v) || "Введите корректный номер телефона!"
            : true;
        }
      ],
      showAlert: false
    };
  },
  methods: {
    async createMember() {
      if (
        (this.$refs.createMemberForm as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        try {
          const payload = {
            first_name: this.firstName,
            last_name: this.lastName,
            ...(this.middleName && { middle_name: this.middleName }),
            birthdate: new Date(String(this.birthdate)),
            gender: this.gender,
            club_id: Number(this.club),
            ...(this.email && { email: this.email }),
            ...(this.phone && { phone: this.phone })
          };

          const { status, data } = await Members.createMember(payload);

          if (status === 200) {
            const { data: member } = data;
            const { id, club_id, club_name } = member;

            this.$root.$emit("onCreatedNewMember", id, club_id, club_name);
            this.dialog = false;
          }
        } catch (error) {
          this.showAlert = true;
        }
      }
    }
  }
});
</script>
