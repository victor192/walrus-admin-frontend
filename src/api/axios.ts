import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_URL } from "@/config/api";
import store from "@/store";
import qs from "qs";

const axiosService: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

axiosService.interceptors.request.use(
  request => {
    if (store.state.auth.loggedIn) {
      request.headers["Authorization"] = store.state.auth.token;
    }

    if (
      request.data &&
      request.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      request.data = qs.stringify(request.data);
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

const request = (config: AxiosRequestConfig, raw = false): Promise<any> => {
  return axiosService
    .request(config)
    .then(response => {
      return raw ? response : response.data;
    })
    .catch(error => {
      if (error.response) {
        const { data, status, headers } = error.response;

        return raw ? { error: "response", data, status, headers } : data;
      } else if (error.request) {
        return raw
          ? { error: "no_response", data: error.request }
          : error.request;
      } else {
        return raw
          ? { error: "custom", message: error.message }
          : error.message;
      }
    });
};

export { axiosService, request };
