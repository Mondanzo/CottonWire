import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";

let routes = [
    { path: "/", component: () => import("./views/Dashboard.vue") }
];

let router = new Router({
    routes,
    mode: "history"
});

Vue.use(Router);

new Vue({
    router,
    render: ce => ce(App),
}).$mount("#app"); 