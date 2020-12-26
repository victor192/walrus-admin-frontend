import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AuthService from "@/services/auth";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/auth",
    name: "auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/Auth/Main.vue"),
    redirect: "/auth/login",
    children: [
      {
        path: "/auth/login",
        name: "auth-login",
        component: () =>
          import(/* webpackChunkName: "auth-login" */ "../views/Auth/Login.vue")
      }
    ]
  },
  {
    path: "/clubs",
    name: "clubs",
    component: () =>
      import(/* webpackChunkName: "clubs" */ "../views/Clubs/Main.vue"),
    redirect: "/clubs/list",
    children: [
      {
        path: "/clubs/list",
        name: "clubs-list",
        component: () =>
          import(
            /* webpackChunkName: "clubs-list" */ "../views/Clubs/List.vue"
          ),
        meta: {
          title: "Список клубов моржей"
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

const publicPages: string[] = ["/auth", "/auth/login"];

router.beforeEach(async (to, from, next) => {
  const token = AuthService.getToken();
  const isPublicPage = publicPages.includes(to.path);

  if (!token && !isPublicPage) {
    next({ path: "/auth/login" });
  } else if (!isPublicPage) {
    await store.dispatch("auth/setToken", token);

    try {
      await store.dispatch("profile/setData");

      next();
    } catch (error) {
      await store.dispatch("auth/logout");

      next({ path: "/auth/login" });
    }
  } else {
    next();
  }
});

export default router;
