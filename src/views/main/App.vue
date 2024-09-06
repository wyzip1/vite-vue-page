<template>
  <div class="h-full p-4 box-border">
    <div class="flex justify-center mb-2 gap-2">
      <router-link to="/info" class="text-blue-700 underline">info</router-link>
    </div>
    <div class="flex justify-center mb-2">
      <van-button type="primary" @click="request()" :loading="loading">
        发起请求
      </van-button>
    </div>
    <div class="flex justify-center mb-2">
      <van-button :disabled="!loading" @click="cancelRequest()">
        中断请求
      </van-button>
    </div>

    <div class="text-center" v-if="data">
      {{ JSON.stringify(data, null, 2) }}
    </div>
  </div>
</template>

<script setup lang="ts" name="HOME" title="home">
import { fetchMockList } from "@/api";
import useRequest from "@/hook/useRequest";

const [request, data, loading, cancelRequest] = useRequest(fetchMockList, {
  initSearch: false,
});
</script>

<style scoped lang="scss"></style>
