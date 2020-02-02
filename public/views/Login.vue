<template>
	<div class="root">
		<div class="card">
			<h1>Login</h1>
			<i-form class="loginForm" @submit.prevent="login()">
				<i-form-group>
					<i-form-label>Username</i-form-label>
					<i-input type="text" name="cottonwire_username" v-model="username"></i-input>
				</i-form-group>
				<i-form-group>
					<i-form-label>Password</i-form-label>
					<i-input type="password" name="cottonwire_password" v-model="password"></i-input>
				</i-form-group>
				<i-form-group inline>
					<i-form-label>Remember me</i-form-label>
					<i-checkbox name="cottonwire_rememberMe" v-model="rememberMe"></i-checkbox>	
				</i-form-group>
				<i-button variant="primary" type="submit">Login</i-button>
			</i-form>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.root {
		margin: 0;
		padding: 0;
		background-color: #f6f6f6;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loginForm {
		display: flex;
		flex-direction: column;
	}

</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			username: "",
			password: "",
			rememberMe: true
		}
	},
	methods: {
		login(){
			this.$store.commit("setLoading", true);
			axios.post("/api/users/login", {
				"username": this.username,
				"password": this.password,
				"rememberMe": this.rememberMe
			}).then((result) => {
				this.$toast("Logged in!");
				this.$store.commit("setUser", result.data.user);
				this.$store.commit("setLoggedIn", true);
				this.$store.commit("setLoading", false);
			}).catch((error) => {
				this.$toast(error.response.data.error, "error");
				this.$store.commit("setLoading", false);
			});
		}
	}
}
</script>