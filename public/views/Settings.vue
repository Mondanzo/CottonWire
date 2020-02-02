<template>
	<div>
		<h1>User Profile</h1>
		<p>Here you can change your user settings.</p>
		<h3>Change Username</h3>
		<i-form @submit.prevent="setUsername">
			<i-form-group>
				<i-form-label>New Username</i-form-label>
				<i-input v-model="updateUsername.username" name="cottonwire_username" type="text" required></i-input>
			</i-form-group>
			<i-form-group>
				<i-form-label>Current Password</i-form-label>
				<i-input v-model="updateUsername.password" name="cottonwire_password" type="password" required></i-input>
			</i-form-group>
			<i-button ref="buttonChangeUsername" class="_margin-top-2" type="submit" block :variant="this.$store.state.themeDark ? 'dark' : 'light'" >
				Change username
				<template v-slot:loading>
					<i-loader size="auto" variant="dark" class="_margin-right-1-2" /> 
					Loading
				</template>
			</i-button>
		</i-form>
		<h3>Change Password</h3>
		<i-form @submit.prevent="setPassword">
			<i-form-group>
				<i-form-label>Current Password</i-form-label>
				<i-input v-model="updatePassword.password" name="cottonwire_password" type="password" required></i-input>
			</i-form-group>
			<i-form-group>
				<i-form-label>New Password</i-form-label>
				<i-input v-model="updatePassword.newpassword" name="cottonwire_newpassword" type="password" required></i-input>
			</i-form-group>
			<i-button ref="buttonChangePassword" class="_margin-top-2" type="submit" block :variant="this.$store.state.themeDark ? 'dark' : 'light'" >
				Change password
				<template v-slot:loading>
					<i-loader size="auto" variant="dark" class="_margin-right-1-2" /> 
					Loading
				</template>
			</i-button>
		</i-form>
		<h3>2 Factor Authentication</h3>
		<p>Enable or disable 2FA.</p>
		<h4 class="_margin-0">WORK IN PROGRESS</h4>
		<h1>Local Settings</h1>
		<p>These settings are locally stored in the browser.</p>
		<h3>Theme</h3>
		<i-radio-button-group v-model="selectedTheme">
    		<i-radio-button value="light">Light</i-radio-button>
    		<i-radio-button value="dark" class="dark" style="">Dark</i-radio-button>
		</i-radio-button-group>
		<h1 class="_text-danger">Danger Zone</h1>
		<p class="_text-danger">Be careful what you press here!</p>
		<i-button variant="danger" @click="deleteAccount()">Delete Account</i-button>
	</div>
</template>

<style scoped lang="scss">
	button.-radio.dark {
		background-color: #343a40;
		color: #ffffff;
	}

	button.-radio.dark:hover {
		background-color: #2f343a !important;
	}

	button.-radio.dark.-active {
		background-color: #282c31 !important;
	}

	.lds-ring div {
		height: 16px;
		width: 16px;
		border-width: 2px;
	}
</style>

<script>
import Loading from "../components/Loading.vue";
import axios from "axios";

export default {
	components: {Loading},
	data(){
		return {
			selectedTheme: this.$store.state.themeDark ? "dark" : "light",
			updateUsername: {
				username: "",
				password: ""
			},
			updatePassword: {
				password: "",
				newpassword: ""
			}
		}
	},
	watch: {
		selectedTheme(){
			this.$store.commit("setTheme", this.selectedTheme);
		}
	},
	methods: {
		setUsername(){
			this.$refs.buttonChangeUsername.loading = true;
			axios.put("/api/users", this.updateUsername).then((result) => {
				this.$refs.buttonChangeUsername.loading = false;
				this.$store.commit("setUser", result.data.user);
				this.updatePassword.username = "";
				this.updateUsername.password = "";
				this.$toast("Username updated!");
			}).catch((err) => {
				this.$refs.buttonChangeUsername.loading = false;
				this.$toast(err.response.data.error, "error");
			});
		},
		setPassword(){
			this.$refs.buttonChangePassword.loading = true;
			axios.put("/api/users", this.updatePassword).then((result) => {
					this.$refs.buttonChangePassword.loading = false;
					this.updatePassword.password = "";
					this.updatePassword.newpassword = "";
					this.showNotification("Password updated!");
				}).catch((err) => {
					this.$refs.buttonChangePassword.loading = false;
					this.$toast(err.response.data.error, "error");
			});
		},
		deleteAccount(){
			this.$confirm("Press OK to delete your account.", "Delete Account?", "question", {
							backdrop: false
						}).then((ok) => {
				if(ok){
					axios.delete("/api/users/delete").then((result) => {
						this.$router.push("/");
						this.$store.commit("setLoggedIn", false);
						this.$store.commit("setUser", null);
					}).catch((err) => {
						this.$alert(err.response.error, "Couldn't delete account!", "error", {
							backdrop: false
						});
					})
				}
			})
		}
	}
}
</script>