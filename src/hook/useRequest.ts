import { ref, onUnmounted, type Ref } from "vue";
import axios from "axios";

export type RequestResult<T> = T extends (...args: any[]) => Promise<infer V>
  ? V
  : never;

export default function useRequest<T extends (...args: any[]) => Promise<any>>(
  requestApi: T,
  options?: {
    params?: Parameters<T>[0] | undefined;
    manual?: boolean;
  },
  handlerData?: (data: RequestResult<T>) => any,
): [
  (params: Parameters<T>[0]) => Promise<RequestResult<T>>,
  Ref<RequestResult<T> | undefined>,
  Ref<boolean>,
  () => void,
] {
  const loading = ref<boolean>(false);
  const data = ref<RequestResult<T> | undefined>();
  const cancelTokenSourceRef = ref(axios.CancelToken.source());

  async function request(params: Parameters<T>[0]) {
    loading.value = true;
    try {
      const res = await requestApi({
        cancelToken: cancelTokenSourceRef.value.token,
        ...params,
      });
      if (handlerData) {
        const value = handlerData(res);
        data.value = value ? res : value;
      } else {
        data.value = res;
      }
      return res;
    } finally {
      loading.value = false;
    }
  }

  function cancelRequest() {
    cancelTokenSourceRef.value.cancel();
    cancelTokenSourceRef.value = axios.CancelToken.source();
  }

  if (!options?.manual && options?.params) {
    request(options.params);
  }

  onUnmounted(() => {
    cancelRequest();
  });

  return [request, data, loading, cancelRequest];
}
