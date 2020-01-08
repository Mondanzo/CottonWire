<template>
    <div>
        <Navigation v-if="loggedIn"></Navigation>
        <router-view></router-view>
    </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
export default {
    components: {Navigation},

    data: function(){
        return {
            loggedIn: true
        }
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
    font-family: sans-serif;
}
</style>