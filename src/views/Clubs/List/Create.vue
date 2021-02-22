<template>
  <v-dialog v-model="dialog" max-width="500px" content-class="text-left">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="green" v-bind="attrs" v-on="on" dark fixed bottom right fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="font-weight-bold">
        Добавление нового клуба
      </v-card-title>
      <v-card-text>
        <v-alert
          v-model="showAlert"
          border="top"
          color="red lighten-2"
          dark
          dismissible
        >
          Произошла ошибка при создании клуба!
        </v-alert>
        <v-form ref="createClubForm" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Название клуба"
            filled
            required
          />
          <v-text-field
            v-model="location"
            :rules="nameRules"
            label="Расположение клуба"
            filled
            required
          />
          <v-btn :disabled="!valid" color="success" @click="createClub">
            Создать
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Clubs } from "@/api";

export default Vue.extend({
  name: "CreateClub",
  data() {
    return {
      dialog: false,
      valid: true,
      name: "",
      nameRules: [(v: string) => !!v || "Это обязательное поле для ввода!"],
      location: "",
      showAlert: false
    };
  },
  watch: {
    dialog(val: boolean) {
      if (!val) {
        this.clearForm();
      }
    }
  },
  methods: {
    async createClub() {
      if (
        (this.$refs.createClubForm as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        const payload = {
          name: this.name,
          location: this.location
        };

        try {
          const { status, data } = await Clubs.createClub(payload);

          if (status === 200) {
            const { data: club } = data;
            const { id } = club;

            this.$root.$emit("onCreatedNewClub", id);
            this.dialog = false;
          }
        } catch (error) {
          this.showAlert = true;
        }
      }
    },
    clearForm() {
      this.name = "";
      this.location = "";
      (this.$refs.createClubForm as Vue & {
        resetValidation: () => void;
      }).resetValidation();
    }
  }
});
</script>
