import { createMapper, Module } from "vuex-smart-module";
import { Clubs } from "@/api";
import {
  BaseListState,
  BaseListGetters,
  BaseListMutations,
  BaseListActions
} from "./base-list";
import { ClubData } from "../interfaces/clubs";
import { BaseListFilter } from "../interfaces/base-list";

class ClubsState extends BaseListState<ClubData> {
  sort = "name";
  direction = "desc";
}

class ClubsGetters extends BaseListGetters<ClubData> {}

class ClubsMutations extends BaseListMutations<ClubData> {}

export class ClubsActions extends BaseListActions<ClubData> {
  async setClubs(payload: BaseListFilter): Promise<boolean> {
    const limit = payload.limit || this.state.limit;
    const offset = payload.offset || this.state.offset;
    const { sort, direction } = this.state;

    try {
      const { status, data } = await Clubs.getList(
        limit,
        offset,
        sort,
        direction
      );

      if (status === 200) {
        const { data: clubs, total, limit, offset } = data;

        this.commit("SET_ITEMS", clubs);
        this.commit("SET_CONTEXT", { total, limit, offset });

        return Promise.resolve(true);
      }

      return Promise.reject(false);
    } catch (error) {
      console.log(error);

      return Promise.reject(false);
    }
  }
}

export const clubs = new Module({
  state: ClubsState,
  getters: ClubsGetters,
  mutations: ClubsMutations,
  actions: ClubsActions
});

export const clubsMapper = createMapper(clubs);
