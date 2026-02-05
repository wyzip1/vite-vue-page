import type { CreateClientConfig } from "./generated/client.gen";
import { filterObjEmpty } from "@/utils";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { showLoadingToast, showDialog } from "vant";
import "vant/es/dialog/style";
import "vant/es/toast/style";

export interface RequestResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface RequestArraybufferResponse {
  type: string;
  filename: string;
  value: ArrayBuffer;
}

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "/developmentApi"
    : window.location.origin;

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(config => {
  // 跳过FormData、URLSearchParams和字符串的处理（字符串可能是已序列化的body，如urlSearchParamsBodySerializer的结果）
  // 只对普通对象进行过滤处理
  if (
    !(config.data instanceof FormData) &&
    !(config.data instanceof URLSearchParams) &&
    !Array.isArray(config.data) &&
    config.data !== null &&
    typeof config.data === "object"
  ) {
    // 只处理对象类型的数据
    config.data = filterObjEmpty(config.data);
  }
  config.params = filterObjEmpty(config.params);
  // @ts-ignore
  if (!config.hideLoading) {
    // @ts-ignore
    config.loadingToast = showLoadingToast({ forbidClick: true, duration: 0 });
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (
    res: Omit<AxiosResponse<RequestResponse<any> | ArrayBuffer>, "config"> & {
      config: AxiosResponse["config"] & { hideDialog?: boolean };
    },
  ) => {
    // @ts-ignore
    res.config.loadingToast?.close();
    if (res.data instanceof ArrayBuffer) {
      const result = handleArraybufferRequest(
        res as AxiosResponse<ArrayBuffer>,
      );
      res.data = result;
    }
    if (![0, 200].includes(res.data.code)) {
      if (res.config.hideDialog) return;
      showDialog({
        title: "错误提示",
        message: res.data?.message || res.statusText || "请求失败",
      });
      return Promise.reject(res);
    }

    return res.data as any;
  },
  (
    err: Omit<AxiosError<RequestResponse<any>>, "config"> & {
      config: AxiosError["config"] & { hideDialog?: boolean };
    },
  ) => {
    console.log("err", err);

    // @ts-ignore
    err.config.loadingToast?.close();
    if (err.code !== "ERR_CANCELED") {
      if (err.config.hideDialog) return;
      showDialog({
        title: "错误提示",
        message: err.response?.data?.message || err.message || "请求失败",
      });
      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);

export const createClientConfig: CreateClientConfig = config => ({
  ...config,
  // 使用配置好的 axios instance（包含拦截器）
  axios: axiosInstance,
  throwOnError: true,
  baseURL,
});

export { axiosInstance };

function handleArraybufferRequest(
  res: AxiosResponse<ArrayBuffer>,
): RequestResponse<RequestArraybufferResponse> {
  const contentType: string = res.headers["content-type"];
  if (contentType.includes("application/json")) {
    const text = new TextDecoder("utf-8");
    const info = text.decode(res.data);
    return JSON.parse(info);
  } else {
    const contentDisposition: string | undefined =
      res.headers["content-disposition"];
    const filename = contentDisposition?.split(";")[1].split("=")[1];
    const result = {
      type: contentType,
      filename: filename || Date.now().toString(),
      value: res.data,
    };
    return {
      code: 200,
      message: "ok",
      data: result,
    };
  }
}
