import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { Response } from "./interface/response";

import { ElMessage } from "element-plus";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "/developmentApi"
      : window.location.origin,
});

instance.interceptors.request.use((config) => {
  if (config.method?.toLocaleUpperCase() === "GET") config.params = config.data;
  return config;
});

instance.interceptors.response.use(
  (res) => {
    if (![0, 200].includes(res.data.code)) {
      ElMessage.error(res.data.msg);
      return Promise.reject(res);
    }
    return res.data;
  },
  (res: AxiosError) => {
    ElMessage.error(res.message);
  }
);

export default function request<T>(
  config: AxiosRequestConfig
): Promise<Response<T>> {
  return instance(config);
}
