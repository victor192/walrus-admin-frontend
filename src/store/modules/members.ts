import { createMapper, Module } from "vuex-smart-module";
import { Members } from "@/api";
import { MemberData } from "../interfaces/member-data.interface";
import { MembersFilter } from "../interfaces/members-filter-interface";
import {
  BaseListActions,
  BaseListGetters,
  BaseListMutations,
  BaseListState
} from "./base-list";

class MembersState extends BaseListState<MemberData> {
  sort = "last_name";
  direction = "desc";
}

class MembersGetters extends BaseListGetters<MemberData> {}

class MembersMutations extends BaseListMutations<MemberData> {}

class MembersActions extends BaseListActions<MemberData> {
  async setMembers(payload: MembersFilter): Promise<boolean> {
    const limit = payload.limit || this.state.limit;
    const offset = payload.offset || this.state.offset;
    const club_id = payload.club_id || null;
    const gender = payload.gender || null;
    const min_age = payload.min_age || null;
    const max_age = payload.max_age || null;
    const search = payload.search || null;
    const { sort, direction } = this.state;

    try {
      const { status, data } = await Members.getList(
        limit,
        offset,
        sort,
        direction,
        club_id,
        gender,
        min_age,
        max_age,
        search
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

export const members = new Module({
  state: MembersState,
  getters: MembersGetters,
  mutations: MembersMutations,
  actions: MembersActions
});

export const membersMapper = createMapper(members);
