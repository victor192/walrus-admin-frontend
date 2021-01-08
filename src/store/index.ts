import Vue from "vue";
import * as Vuex from "vuex";
import { createStore, Module } from "vuex-smart-module";
import { auth } from "./modules/auth";
import { profile } from "./modules/profile";
import { clubs } from "./modules/clubs";
import { members } from "./modules/members";

Vue.use(Vuex);

const root = new Module({
  modules: {
    auth,
    profile,
    clubs,
    members
  }
});

export default createStore(root);
