<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="caches">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import useRouteCache from "./hook/useRouteCache";

const router = useRouter();
const { caches, addCache, removeCache } = useRouteCache();
console.log("router", router.options);

router.beforeEach((to, _, next) => {
  document.title = to.meta.title as string;
  next();
});

let position = 0;
router.afterEach((to, from) => {
  const isBack = position > window.history.state.position;
  if (isBack) {
    removeCache(from.name as string);
  } else if (to.meta.keepAlive) addCache(to.name as string);

  console.log(
    isBack ? "返回 <-" : "进入 ->",
    isBack ? from.meta.title : to.meta.title,
  );

  position = window.history.state?.position || 0;
});
</script>

<style lang="scss" scoped></style>

<style>
html {
  background-color: #f7f8fa;
}
</style>
