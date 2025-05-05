import { BASE_URL } from "@/constants/urls";
import axios, { AxiosResponse } from "axios";
import { get } from "./storage";
import { HttpResponse } from "@/interfaces/Response";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config: any) => {
    if (typeof window !== "undefined") {
      const token = get("token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const _get = (
  url: string,
  config: object = {}
): Promise<AxiosResponse<HttpResponse>> => {
  return client.get(url, config);
};

export const _post = (
  url: string,
  data: object = {},
  config: object = {}
): Promise<AxiosResponse<HttpResponse>> => {
  return client.post(url, data, config);
};

export const _delete = (
  url: string,
  config: object = {}
): Promise<AxiosResponse<HttpResponse>> => {
  return client.delete(url, config);
};
