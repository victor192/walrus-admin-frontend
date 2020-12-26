import { Auth } from "@/api";
import { TOKEN_KEY_NAME } from "@/config/auth";
import { AuthCredentialsRequestDTO } from "@/api/dto/auth";

class AuthService {
  setToken(tokenType: string, tokenValue: string): string {
    const token: string = tokenType + " " + tokenValue;

    localStorage.setItem(TOKEN_KEY_NAME, token);

    return token;
  }

  getToken(): any {
    return localStorage.getItem(TOKEN_KEY_NAME);
  }

  resetToken(): void {
    localStorage.removeItem(TOKEN_KEY_NAME);
  }

  async login(
    authCredentials: AuthCredentialsRequestDTO
  ): Promise<[boolean, string]> {
    try {
      const response = await Auth.login(authCredentials);
      const { status, data } = response;

      if (status === 200) {
        const { token_type, access_token } = data;

        return [true, this.setToken(token_type, access_token)];
      }

      return [false, ""];
    } catch (error) {
      console.log(error);

      return [false, ""];
    }
  }
}

export default new AuthService();
