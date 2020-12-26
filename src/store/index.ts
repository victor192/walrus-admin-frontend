import Vue from "vue";
import * as Vuex from "vuex";
import { createStore, Module } from "vuex-smart-module";
import { auth } from "./modules/auth";
import { profile } from "./modules/profile";
import { clubs } from "./modules/clubs";

Vue.use(Vuex);

const root = new Module({
  modules: {
    auth,
    profile,
    clubs
  }
});

export default createStore(root);
