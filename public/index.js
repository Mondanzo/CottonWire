import Vue from "vue";
import Router from "vue-router";
import VueSimpleAlert from "vue-simple-alert";

import App from "./App.vue";

import store from "./store";
import routes from "./routes";

import '@inkline/inkline/dist/inkline.css';
import Inkline from '@inkline/inkline';

let router = new Router({
   routes,
   mode: "history"
});

Vue.use(Inkline);
Vue.use(Router);
Vue.use(VueSimpleAlert);

Vue.prototype.$toast = function(message, type, duration){
   this.$fire({
      text: message,
      type: type ? type : "success",
      timer: duration ? duration : 3000,
      position: 'top-end',
      toast: true,
      showConfirmButton: false
   });
}

let vue = new Vue({
    router,
    store,
    render: ce => ce(App),
}).$mount("#app"); 

router.beforeEach((to, from, next) => {
   vue.$store.commit("setLoading", true);
   next();
})

router.afterEach((to, from) => {
   vue.$store.commit("setLoading", false);
})

Vue.config.errorHandler = function(err, vm, info){
   vm.$alert(err, "Error in " + info, "error", {
      backdrop: "#111"
   })
}