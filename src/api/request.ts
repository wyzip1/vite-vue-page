import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

export interface Response<T> {
  resultStatus: number;
  resultCode: string;
  resultMessage: string;
  data: T;
}

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
      // ElMessage.error(res.data.msg);
      return Promise.reject(res);
    }
    return res.data;
  },
  (err: AxiosError) => {
    // ElMessage.error(res.message);
    return Promise.reject(err);
  }
);

export default function request<T>(
  config: AxiosRequestConfig
): Promise<Response<T>> {
  return instance(config);
}
