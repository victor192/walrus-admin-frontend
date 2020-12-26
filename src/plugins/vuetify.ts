import Vue from "vue";
import Vuetify from "vuetify/lib";
import ru from "vuetify/src/locale/ru";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: "mdi",
  lang: {
    locales: { ru },
    current: "ru"
  }
});
