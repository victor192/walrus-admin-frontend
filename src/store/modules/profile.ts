import {
  Mutations,
  Getters,
  Actions,
  Module,
  createMapper
} from "vuex-smart-module";
import { ProfileData } from "../interfaces/profile-data.interface";
import { Users } from "@/api";

class ProfileState {
  data: ProfileData = {
    id: 0,
    email: "",
    name: ""
  };
}

class ProfileGetters extends Getters<ProfileState> {
  get name(): string {
    return this.state.data.name;
  }
}

class ProfileMutations extends Mutations<ProfileState> {
  SET_PROFILE_USER(data: any) {
    this.state.data = Object.assign(this.state.data, data);
  }
}

export class ProfileActions extends Actions<
  ProfileState,
  ProfileGetters,
  ProfileMutations
> {
  async setData(): Promise<[boolean, any]> {
    try {
      const { status, data } = await Users.getMyProfile();
      const { data: profile } = data

      if (status === 200) {
        this.commit("SET_PROFILE_USER", profile);

        return Promise.resolve([true, data]);
      }

      return Promise.reject([false, data]);
    } catch (error) {
      console.log(error);

      return Promise.reject([false, error]);
    }
  }
}

export const profile = new Module({
  state: ProfileState,
  getters: ProfileGetters,
  mutations: ProfileMutations,
  actions: ProfileActions
});

export const profileMapper = createMapper(profile);
