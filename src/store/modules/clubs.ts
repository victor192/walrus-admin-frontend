import {
  createMapper,
  Getters,
  Mutations,
  Actions,
  Module
} from "vuex-smart-module";
import { Clubs } from "@/api";
import { ClubData, ClubsListFilter } from "../interfaces/clubs";

class ClubsState {
  list: ClubData[] = [];
  total = 0;
  limit = 50;
  offset = 0;
}

class ClubsGetters extends Getters<ClubsState> {
  get isClubs() {
    return this.state.list.length > 0;
  }
}

class ClubsMutations extends Mutations<ClubsState> {
  SET_CLUBS_ITEMS(items: any[]) {
    this.state.list = items;
  }
  SET_CLUBS_CONTEXT(context: any) {
    this.state.total = context.total || 0;
    this.state.limit = context.limit || 50;
    this.state.offset = context.offset || 0;
  }
}

export class ClubsActions extends Actions<
  ClubsState,
  ClubsGetters,
  ClubsMutations
> {
  async setClubs(payload: ClubsListFilter): Promise<boolean> {
    const limit = payload.limit || this.state.limit;
    const offset = payload.offset || this.state.offset;

    try {
      const { status, data } = await Clubs.getList(limit, offset);

      if (status === 200) {
        const { data: clubs, total, limit, offset } = data;

        this.commit("SET_CLUBS_ITEMS", clubs);
        this.commit("SET_CLUBS_CONTEXT", { total, limit, offset });

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
