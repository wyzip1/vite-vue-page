<template>
  <div class="h-full p-4 box-border">
    <div class="flex justify-center mb-2">
      <router-link to="/info" class="text-blue-700 underline">info</router-link>
    </div>
    <div class="flex gap-2 justify-center mb-2">
      <van-button type="primary" @click="startRequest()" :loading="loading">
        发起请求
      </van-button>
      <van-button :disabled="!loading" @click="cancelRequest()">
        中断请求
      </van-button>
    </div>

    <div class="flex justify-center whitespace-pre-wrap" v-if="data">
      <div class="max-w-max">{{ JSON.stringify(data, null, 4) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="HOME" title="home">
import { fetchMockList } from "@/api";
import useRequest from "@/hook/useRequest";

const [request, data, loading, cancelRequest] = useRequest(fetchMockList, {
  initSearch: false,
});

function startRequest() {
  request({ pageNum: 1, pageSize: 10 });
}
</script>

<style scoped lang="scss"></style>
