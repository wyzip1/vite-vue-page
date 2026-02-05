import type { RequestResponse } from "@/api/config";
import useRequest from "./useRequest";
import { Reactive } from "vue";

export interface Pagination {
  pageNum: number;
  pageSize: number;
}

export interface List<T> {
  list?: T[];
  total?: number;
}

export type ItemType<T> = T extends (
  ...args: any[]
) => Promise<RequestResponse<List<infer V>>>
  ? V
  : never;

interface ListState<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  loading: boolean;
  list: Array<ItemType<T>>;
}

export default function useFetchList<
  T extends (...args: any[]) => Promise<RequestResponse<List<any>>>,
  PN extends string = "pageNum",
  PS extends string = "pageSize",
>(
  fetchApi: T,
  searchParams: Omit<Parameters<T>[0], "query" | "body"> & {
    body?: Omit<NonNullable<Parameters<T>[0]["body"]>, PN | PS>;
    query?: Omit<NonNullable<Parameters<T>[0]["query"]>, PN | PS>;
  },
  defaultOptions: {
    pageSize?: number;
    manual?: boolean;
    propName?: {
      pageNum?: PN;
      pageSize?: PS;
      total?: string;
      list?: string;
    };
  } = { manual: false },
): [
  (pageOptions: Pagination) => ReturnType<T>,
  Reactive<ListState<T>>,
  {
    doSearch: () => ReturnType<T>;
    updateList: (
      callback?: (list: Reactive<ListState<T>>["list"]) => any,
    ) => void;
    refreshList: () => ReturnType<T>;
    resetState: () => void;
  },
] {
  const [request, data, loading] = useRequest(fetchApi, {
    manual: true,
  });

  const state = reactive<ListState<T>>({
    pageNum: 1,
    pageSize: defaultOptions?.pageSize || 10,
    total: 0,
    loading: false,
    list: [],
  });

  watchEffect(() => {
    state.loading = loading.value;
    state.total =
      data.value?.data?.[defaultOptions.propName?.total || "total"] || 0;
    state.list =
      data.value?.data?.[defaultOptions.propName?.list || "list"] || [];
  });

  const pageChangeRequestRef = ref<{
    resolve: (v: any) => void;
    reject: (reason: any) => void;
  }>();

  const updateParams = (params: Pagination) => {
    return new Promise((rev, rej) => {
      pageChangeRequestRef.value = { resolve: rev, reject: rej };
      state.pageNum = params.pageNum || state.pageNum;
      state.pageSize = params.pageSize || state.pageSize;
    }) as ReturnType<T>;
  };

  const onSearch = (): ReturnType<T> => {
    const params: Parameters<T>[0] = {
      ...searchParams,
    };
    let paramsName = "query";
    if (params?.body) paramsName = "body";
    if (!params![paramsName]) (params![paramsName] as any) = {};
    params![paramsName][defaultOptions.propName?.pageNum || "pageNum"] =
      state.pageNum;
    params![paramsName][defaultOptions.propName?.pageSize || "pageSize"] =
      state.pageSize;
    return request(params) as ReturnType<T>;
  };

  const doSearch = (): ReturnType<T> => {
    if (state.pageNum === 1) return onSearch();
    else return updateParams({ pageNum: 1, pageSize: state.pageSize });
  };

  const updateList = (
    callback: (list: typeof state.list) => typeof state.list = list => list,
  ) => {
    state.list = callback(state.list);
    data.value = {
      ...data.value!,
      data: {
        ...data.value?.data,
        list: callback(
          data.value?.data?.[defaultOptions.propName?.list || "list"] || [],
        ),
      },
    };
  };

  const refreshList = () => {
    return onSearch();
  };

  const isResetRef = ref(false);
  const resetState = () => {
    state.pageNum = 1;
    state.pageSize = defaultOptions?.pageSize || 10;
    data.value = undefined;
    if (
      state.pageNum !== 1 ||
      state.pageSize !== (defaultOptions?.pageSize || 10)
    ) {
      isResetRef.value = true;
    }
  };

  const initRef = ref<boolean>(true);

  watch(
    [state.pageNum, state.pageSize],
    () => {
      if (isResetRef.value) {
        isResetRef.value = false;
        return;
      }
      if (initRef.value && defaultOptions.manual) {
        initRef.value = false;
        return;
      }
      onSearch()
        .then(pageChangeRequestRef.value?.resolve)
        .catch(pageChangeRequestRef.value?.reject)
        .finally(() => {
          pageChangeRequestRef.value = undefined;
        });
    },
    { immediate: !defaultOptions.manual },
  );

  return [
    updateParams,
    state,
    { doSearch, updateList, refreshList, resetState },
  ];
}
