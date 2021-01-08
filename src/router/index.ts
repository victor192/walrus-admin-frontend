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
      },
      {
        path: "/clubs/:id",
        name: "clubs-club",
        component: () =>
          import(
            /* webpackChunkName: "clubs-club" */ "../views/Clubs/Club.vue"
          ),
        meta: {
          title: "Информация о клубе",
          backLink: true
        }
      }
    ]
  },
  {
    path: "/members",
    name: "members",
    component: () =>
      import(/* webpackChunkName: "members" */ "../views/Members/Main.vue"),
    redirect: "/members/list",
    children: [
      {
        path: "/members/list",
        name: "members-list",
        component: () =>
          import(
            /* webpackChunkName: "members-list" */ "../views/Members/List.vue"
          ),
        meta: {
          title: "Список участников"
        }
      },
      {
        path: "/members/:id",
        name: "members-member",
        component: () =>
          import(
            /* webpackChunkName: "members-member" */ "../views/Members/Member.vue"
          ),
        meta: {
          title: "Информация об участнике",
          backLink: true
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
