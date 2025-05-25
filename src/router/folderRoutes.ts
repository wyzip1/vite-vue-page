import type { ComponentOptions } from "vue";
import type { RouteRecordRaw } from "vue-router";

interface PageOptions extends ComponentOptions {
  name?: string;
  title?: string;
  keepAlive?: boolean;
}

type filterParam = { key: string; page: { default: PageOptions } };
const pages = import.meta.glob("../views/**/App.vue", { eager: true });

export function folderRoutes(mainPageName = "MAIN"): RouteRecordRaw[] {
  const formatPathReg = /\.\.\/views|\/App\.vue/g;
  const createRouterItem = ({ key, page }: filterParam): RouteRecordRaw => {
    return {
      path: key.replace(formatPathReg, ""),
      name: page.default.name,
      meta: { title: page.default.title, keepAlive: page.default.keepAlive },
      component: page.default,
    };
  };

  const findParentPage = (
    key: string,
    routerList = routeList,
  ): RouteRecordRaw | undefined => {
    key = key.replace(formatPathReg, "");
    const parentPage = routerList.find((router) => key.includes(router.path));
    if (!parentPage) return;
    if (!parentPage.children) {
      parentPage.children = [];
      return parentPage;
    }
    return findParentPage(key, parentPage.children) || parentPage;
  };

  const routeList: RouteRecordRaw[] = [];
  for (const key of Object.keys(pages)) {
    const page = pages[key] as unknown as { default: ComponentOptions };

    const router = createRouterItem({ key, page });
    const parentPage = findParentPage(key);
    if (parentPage) {
      !parentPage.redirect && (parentPage.redirect = router.path);
      (parentPage.children as RouteRecordRaw[]).push(router);
    } else if (page.default.name === mainPageName) {
      routeList.unshift(router);
    } else routeList.push(router);
  }

  routeList.unshift({ path: "/", redirect: routeList[0].path });
  routeList.push({ path: "/:chapters*", redirect: "/" });

  return routeList;
}
