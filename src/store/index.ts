import Vue from "vue";
import * as Vuex from "vuex";
import { createStore, Module } from "vuex-smart-module";
import { auth } from "./modules/auth";
import { profile } from "./modules/profile";
import { clubs } from "./modules/clubs";
import { members } from "./modules/members";
import { orders } from "./modules/orders";

Vue.use(Vuex);

const root = new Module({
  modules: {
    auth,
    profile,
    clubs,
    members,
    orders
  }
});

export default createStore(root);
