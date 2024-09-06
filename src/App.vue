<template>
  <div class="page-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

router.beforeResolve((to, _, next) => {
  document.title = to.meta.title as string;
  console.log("进入 ->", to.meta.title);
  next();
});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 12px 16px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: max(12px, constant(safe-area-inset-bottom));
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>

<style>
html {
  background-color: #f7f8fa;
}
</style>
