import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/Login/Register.vue";
import Login from "../views/Login/Login.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/login'
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  }
];

const router = new VueRouter({
  routes
});

export default router;
