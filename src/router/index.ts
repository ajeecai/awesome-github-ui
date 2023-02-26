import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../components/home/HomePage.vue"),
    },
    { path: "/home", redirect: "/" },
    {
      path: "/lang",
      name: "lang",
      props: true,
      component: () => import("../components/langs/LangRoot.vue"),
    },
    {
      path: "/lang/:id",
      name: "langid",
      props: true,
      component: () => import("../components/langs/LangMileStone.vue"),
    },
    {
      path: "/explore",
      name: "explore",
      component: () => import("../components/explore/ExploreInteresting.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../components/about/AboutPage.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../components/auth/UserAuth.vue"),
    },
    {
      path: "/userinfo",
      name: "userinfo",
      component: () => import("../components/auth/UserInfo.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/forgetpass",
      name: "forgetpass",
      component: () => import("../components/auth/ForgetPass.vue"),
      props: (route) => ({ query: route.query }),
    },
    {
      path: "/:notFound(.*)",
      name: "notFound",
      component: () => import("../components/NotFound.vue"),
    },
  ],
});

router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters["auth/userName"]) {
    next("/auth");
  } else {
    next();
  }
});

export default router;
