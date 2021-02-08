import {
  Mutations,
  Getters,
  Actions,
  Module,
  createMapper
} from "vuex-smart-module";
import { AuthCredentialsRequestDTO } from "@/api/dto/auth-credentials-request.dto";
import AuthService from "@/services/auth";

class AuthState {
  loggedIn = false;
  token = "";
}

class AuthGetters extends Getters<AuthState> {}

class AuthMutations extends Mutations<AuthState> {
  SET_AUTH_TOKEN(token: string) {
    this.state.token = token;
    this.state.loggedIn = true;
  }

  CLEAR_AUTH_TOKEN() {
    this.state.token = "";
    this.state.loggedIn = false;
  }
}

class AuthActions extends Actions<AuthState, AuthGetters, AuthMutations> {
  async login(
    authCredentials: AuthCredentialsRequestDTO
  ): Promise<[boolean, string]> {
    const [isSuccessLogin, token] = await AuthService.login(authCredentials);

    if (isSuccessLogin) {
      this.commit("SET_AUTH_TOKEN", token);

      return Promise.resolve([true, token]);
    } else {
      return Promise.reject([false, token]);
    }
  }

  setToken(token: string): void {
    this.commit("SET_AUTH_TOKEN", token);
  }

  logout(): void {
    AuthService.resetToken();

    this.commit("CLEAR_AUTH_TOKEN");
  }
}

export const auth = new Module({
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions
});

export const authMapper = createMapper(auth);
