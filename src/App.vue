<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
const router = useRouter();

router.beforeResolve((to, _, next) => {
  document.title = to.meta.title as string;
  console.log("进入 ->", to.meta.title);
  next();
});
</script>
