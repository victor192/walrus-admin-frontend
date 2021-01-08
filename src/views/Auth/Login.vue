<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
      overlay-color="#0E0E2C"
      overlay-opacity="1"
      content-class="text-left"
    >
      <v-card class="px-4">
        <v-card-title>Авторизация</v-card-title>
        <v-card-text>
          <v-alert
            v-model="showAlert"
            border="top"
            color="red lighten-2"
            dark
            dismissible
          >
            Неправильный email-адрес или пароль!
          </v-alert>
          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              append-icon="mdi-email"
              :rules="emailRules"
              label="E-mail адрес"
              required
            />
            <v-text-field
              v-model="password"
              append-icon="mdi-eye-off"
              :rules="passwordRules"
              type="password"
              label="Пароль"
            />
            <v-btn :disabled="!valid" color="success" @click="validate">
              Войти
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { authMapper } from "@/store/modules/auth";

export default Vue.extend({
  name: "AuthLogin",
  data() {
    return {
      dialog: true,
      valid: false,
      email: "",
      emailRules: [
        (v: string) => !!v || "Это обязательное поле для ввода!",
        (v: string) => /.+@.+\..+/.test(v) || "Введите корректный e-mail адрес!"
      ],
      password: "",
      passwordRules: [(v: string) => !!v || "Это обязательное поле для ввода!"],
      showAlert: false
    };
  },
  methods: {
    ...authMapper.mapActions({
      authLogin: "login"
    }),
    async validate() {
      this.showAlert = false;

      if (
        (this.$refs.loginForm as Vue & { validate: () => boolean }).validate()
      ) {
        const { email, password } = this;

        try {
          await this.authLogin({ email, password });
          await this.$router.push("/clubs");
        } catch (error) {
          console.log(error);

          this.showAlert = true;
        }
      }
    }
  }
});
</script>
