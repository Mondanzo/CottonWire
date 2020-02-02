<template>
    <i-layout-aside>
        <i-sidebar :collapse="false" :variant="this.$store.state.themeDark ? 'dark' : 'light'">
            <i-nav vertical>
                <div class="profile-background _width-100 _padding-1">
                    <Avatar class=" _display-block" :hash="this.$store.state.user.username" :size="64"></Avatar>
                    <i-dropdown placement="bottom-start">
                        <i-nav-item>
                            <p class="_display-inline h5">{{ this.$store.state.user.username }}</p>
                            <i-icon icon="chevron-down"></i-icon>
                       </i-nav-item>
                       <i-dropdown-menu :variant="this.$store.state.themeDark ? 'dark' : 'light'">
                           <i-dropdown-item :to="'/users/' + this.$store.state.user.username">Profile</i-dropdown-item>
                           <i-dropdown-item to="/settings">Settings</i-dropdown-item>
                           <i-dropdown-divider></i-dropdown-divider>
                           <i-dropdown-item href="/logout">Logout</i-dropdown-item>
                       </i-dropdown-menu>
                </i-dropdown>
               </div>

               <i-nav-item to="/">Dashboard</i-nav-item>
               <i-nav-item to="/users">Users</i-nav-item>
               <i-nav-item to="/modpacks">Modpacks</i-nav-item>
               <i-nav-item to="/mods">Mods</i-nav-item>
               <i-nav-item to="/keys">Keys</i-nav-item>
               <i-nav-item to="/clients">Clients</i-nav-item>
           </i-nav>
           <hr class="_margin-0">
           <div class="footer_content _margin-x-1">
            <p>CottonWire &copy; Mondanzo 2020</p>
            <a href="https://github.com/Mondanzo/CottonWire">Github</a>
           </div>
       </i-sidebar>
    </i-layout-aside>
</template>

<script>
import Avatar from "./Avatar.vue";
export default {
    components: {Avatar}
}
</script>
<style scoped>
    .profile-background {
        background-image: url("https://cdn.dribbble.com/users/146798/screenshots/2050800/dribbble_pattern.png");
        background-size: cover;
    }
</style>