import { request } from "../axios";
import { AuthCredentialsRequestDTO } from "../dto/auth-credentials-request.dto";

const login = async (data: AuthCredentialsRequestDTO) => {
  return await request(
    {
      url: "/auth/login",
      method: "POST",
      data
    },
    true
  );
};

export default { login };
