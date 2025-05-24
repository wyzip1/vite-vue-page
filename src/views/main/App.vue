<template>
  <div class="page-container">
    <div class="flex justify-center mb-2">
      <router-link to="/info" class="text-blue-700 underline">info</router-link>
    </div>
    <div class="flex gap-2 justify-center mb-2">
      <van-button type="primary" @click="request()" :loading="loading">
        发起请求
      </van-button>
      <van-button :disabled="!loading" @click="handleStopRequst">
        中断请求
      </van-button>
    </div>

    <div class="flex justify-center whitespace-pre-wrap" v-if="data">
      <div class="max-w-max">{{ JSON.stringify(data, null, 4) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="MAIN" title="home">
import { fetchMockList } from "@/api";
import useRequest from "@/hook/useRequest";
import { showDialog } from "vant";

const [request, data, loading, cancelRequest] = useRequest(fetchMockList, {
  manual: true,
  params: { pageNum: 1, pageSize: 10 },
});

function handleStopRequst() {
  cancelRequest();
  showDialog({
    title: "提示",
    message: "请求已中断",
  });
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 12px 16px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: max(12px, constant(safe-area-inset-bottom));
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>
