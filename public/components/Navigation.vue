<template>
    <i-layout-aside>
        <i-sidebar :collapse="false" :variant="this.$store.state.themeDark ? 'dark' : 'light'">
            <i-nav vertical>
                <i-dropdown placement="bottom-start">
                    <i-nav-item class="_display-inline">
                        <i-icon icon="chevron-down" size="sm"></i-icon>
                           {{ this.$store.state.user.username }}
                       <Avatar :hash="this.$store.state.user.username" :size="32"></Avatar>
                   </i-nav-item>
                   <i-dropdown-menu :variant="this.$store.state.themeDark ? 'dark' : 'light'">
                       <i-dropdown-item :to="'/users/' + this.$store.state.user.username">Profile</i-dropdown-item>
                       <i-dropdown-item to="/settings">Settings</i-dropdown-item>
                       <i-dropdown-divider></i-dropdown-divider>
                       <i-dropdown-item href="/logout">Logout</i-dropdown-item>
                   </i-dropdown-menu>
               </i-dropdown>

               <i-nav-item to="/">Dashboard</i-nav-item>
               <i-nav-item to="/users">Users</i-nav-item>
               <i-nav-item to="/modpacks">Modpacks</i-nav-item>
               <i-nav-item to="/mods">Mods</i-nav-item>
               <i-nav-item to="/keys">Keys</i-nav-item>
               <i-nav-item to="/clients">Clients</i-nav-item>
           </i-nav>
       </i-sidebar>
    </i-layout-aside>
</template>

<script>
import Avatar from "./Avatar.vue";
export default {
    components: {Avatar}
}
</script>