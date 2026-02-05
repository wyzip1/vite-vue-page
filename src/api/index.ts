import type { List, Pagination } from "@/hook/useFetchList";
import type { RequestResponse } from "./config";
import { axiosInstance } from "./config";
import { CancelTokenSource } from "axios";

export interface MockListItem {
  id: number;
  name: string;
  sex: number;
  desc: string;
  data: {
    money: number;
  };
  test?: any;
  date?: string;
  dateRange?: [string, string];
}

export interface MockListParams extends Pagination {
  name?: string;
}

export const fetchMockList = ({
  cancelToken,
  body,
}: {
  cancelToken?: CancelTokenSource["token"];
  body?: MockListParams;
}) => {
  // @ts-ignore
  return axiosInstance({
    url: "/api/list",
    method: "POST",
    cancelToken: cancelToken,
    data: body,

    hideLoading: true,
  }) as Promise<RequestResponse<List<MockListItem>>>;
};
