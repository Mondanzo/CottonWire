<template>
	<div>
		<div v-if="showingUser">
			<router-link to="/users">Back</router-link>
			<div class="username">
				{{ showingUser.username }}
				<Avatar :hash="showingUser.username"></Avatar>
			</div>
			<hr>
			<h2>Permissions</h2>
			<ul>
				<li>MANAGE_MODPACKS</li>
				<li>MANAGE_USERS</li>
				<li>MANAGE_MODS</li>
				<li>MANAGE_KEYS</li>
				<li>MANAGE_CLIENTS</li>
				<li>ADMINISTRATOR</li>
			</ul>
		</div>
		<div v-else class="profiles">
			<router-link v-for="user in users" v-bind:key="user.id" :to="'/users/' + user.username" class="profile">
				<Avatar class="avatar" :hash="user.username"></Avatar>
				<h2>{{user.username}}</h2>
			</router-link>
			<div class="profile" @click="addUserModal = true">
				<svg class="avatar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
				<h2>Add new profile</h2>
			</div>
			<i-modal :variant="this.$store.state.themeDark ? 'dark' : 'light'" v-model="addUserModal" class="_text-dark">
    			<template slot="header">Modal Header</template>
				 <i-form-label>Username</i-form-label>
    			<i-input v-model="addUsername" placeholder="coolusername"></i-input>
    			<template slot="footer"><i-button :disabled="addUsername.length < 1" @click="createUser()">Create new User</i-button></template>
			</i-modal>
		</div>
	</div>
</template>

<style scoped>
	.profiles {
		display: flex;
	}
	
	.profile {
		cursor: pointer;
		background-color: #9992;
		display: inline;
		text-align: center;
		padding: 24px;
		margin: 16px;
		border-radius: 6px;
		color: unset;
		text-decoration: unset;
	}

	.username {
		font-size: 2em;
	}

	.profile h2 {
		margin: 0;
	}

	.profile .avatar {
		height: 80px;
		width: 80px;
	}
</style>

<script>
import axios from "axios";
import Avatar from "../components/Avatar.vue";

export default {
	components: {Avatar},
	data(){
		return {
			showingUser: null,
			users: [],
			addUserModal: false,
			addUsername: ""
		}
	},
	created(){ 
		this.decideWhatToGet()
	},
	methods: {
		setData(user){
			this.showingUser = user;
		},
		setError(error){

		},
		decideWhatToGet(){
			this.showingUser = null;
			if(this.$route.params.hasOwnProperty("user")){
				this.fetchUser();
			} else {
				this.fetchUsers();
			}
		},
		fetchUser(){
			axios.get("/api/users/" + this.$route.params.user).then((result) => {
				this.showingUser = result.data.result;
			})
		},
		fetchUsers(){
			axios.get("/api/users").then((result) => {
				this.users = result.data;
			});
		},
		createUser(){
			this.addUserModal = false;
			axios.post("/api/users/add", {
				"username": this.addUsername
			}).then((result) => {
				this.$alert("Username: " + result.data.result.username + " \nPassword: " + result.data.result.password, "Account created", "success", {
					backdrop: false
				});
				this.addUsername = "";
				this.fetchUsers();
			}).catch((err) => {
				this.$alert(err.response.data.error, "An error occured!", "error", {
					backdrop: false
				});
			});
		}
	},
	watch: {
		"$route": "decideWhatToGet"
	}
	
}
</script>