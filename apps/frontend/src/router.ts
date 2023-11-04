import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/Login.vue"),
  },
  {
    path: "/",
    component: () => import("./layouts/Main.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("./pages/Home/Home.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./pages/NotFound.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
