<template>
    <div class="_width-100 _height-100 _overflow-hidden _padding-0">
        <div class="loading" :class="{show : this.$store.state.loading, dark : this.$store.state.themeDark}">
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
        <transition>
        <i-layout v-if="this.$store.state.loggedIn" class="_height-100">
            <i-layout-header class="_padding-0">
              <i-navbar :variant="this.$store.state.themeDark ? 'dark' : 'light'" :collapse="false">
                <i-navbar-brand>CottonWire</i-navbar-brand>
              </i-navbar>
            </i-layout-header>
            <i-layout vertical>
              <Navigation></Navigation>
              <i-layout-content class="_overflow-auto" :class="{'_background-gray-90' : this.$store.state.themeDark, '_text-light' : this.$store.state.themeDark}">
                <router-view id="currentView" class="_margin-2"></router-view>
              </i-layout-content>
            </i-layout>
            <i-layout-footer class="_margin-bottom-4">
              <p>CottonWire 2020 & Mondanzo</p>
            </i-layout-footer>
        </i-layout>
        <div v-else>
            <LoginView>
        </div>
        </transition>
    </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import LoginView from "./views/Login.vue";
import axios from "axios";

export default {
    components: {Navigation, LoginView},
    data(){
      return {
        collapsed: false
      }
    },
    beforeMount(){
      axios.get("/api/users/verify").then((result) => {
        this.$store.commit("setUser", result.data);
        this.$store.commit("setLoggedIn", true);
        this.$store.commit("setLoading", false);
      }).catch((error) => {
        console.log(error);
        this.$store.commit("setLoading", false);
      });
    },
    beforeRouteUpdate(to, from, next){
      console.log("navigating to", to)
      axios.get("/api/users/verify").then((result) => {
        this.$store.commit("setUser", result.data);
        this.$store.commit("setLoggedIn", true);
        next();
        this.$store.commit("setLoading", false);
      }).catch((error) => {
        console.log(error);
        next();
        this.$store.commit("setLoading", false);
      });
    }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
  width: 100vw;
}
.loading {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ccc;
    z-index: 10;
    transition: opacity 200ms ease;
}

.loading.dark {
  background-color: #222;
}

.loading.show {
    pointer-events: all;
    opacity: 1;
}

</style>