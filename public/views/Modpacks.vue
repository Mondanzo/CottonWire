<template>
	<div>
		<i-layout v-if="modpacks.length" vertical>
			<i-layout-aside class="modpacksList">
				<h2>Modpacks</h2>
				<i-nav vertical>
					<i-button variant="primary" @click="createNewModpackModal = true" class="_margin-y-1">Create another modpack</i-button>
					<i-nav-item v-for="modpack in modpacks" :key="modpack.id" :to="'/modpacks/' + modpack.name">
							<img :src="modpack.icon" :alt="modpack.name">
							{{ modpack.display_name}}
					</i-nav-item>
				</i-nav>
			</i-layout-aside>
			<i-layout-aside class="_margin-left-8">
				<router-view @updated="fetchModpacks()"></router-view>
			</i-layout-aside>
		</i-layout>
		<div v-else class="placeholder">
			<h1>You got no modpacks yet!</h1>
			<i-button variant="primary" @click="createNewModpackModal = true">Create a modpack now!</i-button>
		</div>
		<i-modal v-model="createNewModpackModal" :variant="this.$store.state.themeDark ? 'dark' : 'light'">
    		<template slot="header">Create a new Modpack</template>
    			<i-form :schema="newModpackForm" @submit.prevent="createNewModpack()">
					 <i-form-group>
						 <i-form-label class="_text-dark">Modpack name</i-form-label>
						 <i-input :schema="newModpackForm.displayname" v-model="newModpackForm.displayname.value" placeholder="The best Modpack">
					 </i-form-group>
					 <i-form-group>
						<i-form-label class="_text-dark">Modpack slug</i-form-label>
					 	<i-input :schema="newModpackForm.slug" v-model="newModpackForm.slug.value" placeholder="the-best-modpack" readonly>
					 </i-form-group>
    			</i-form>
    		<template slot="footer"><i-button @click="createNewModpack()" variant="primary" :disabled="newModpackForm.invalid || newModpackForm.pristine">Create Modpack</i-button></template>
		</i-modal>
	</div>
</template>

<script>
import axios from "axios";


export default {
	beforeMount(){
		this.fetchModpacks();
	},
	data() {
		return {
			modpacks: [],
			createNewModpackModal: false,
			newModpackForm: this.$inkline.form({
				slug: {
					value: "",
					validators: [
						{ rule: "maxLength", value: 64},
						{ rule: "alphanumeric", allowDashes: true},
						{ rule: "required" }
					]
				},
				displayname: {
					value: "",
					validators: [
						{ rule: "maxLength", value: 64},
						{ rule: "required" }
					]
				}
			})
		}
	},
	methods: {
		fetchModpacks(){
			axios.get("/api/modpack?include=full").then((result) => {
				this.modpacks = result.data.modpacks;
			})
		},
		createNewModpack(){
			axios.post("/api/modpack", {
				slug: this.newModpackForm.slug.value,
				display_name: this.newModpackForm.displayname.value
			}).then((result) => {
				if(result.data === true){
					this.$toast("Modpack " + this.newModpackForm.displayname.value + " created!", "success", 5000);
					this.newModpackForm.displayname.value = "";
					this.createNewModpackModal = false;
					this.fetchModpacks();
				}
				else this.$toast("Couldn't create Modpack!", "error");
			}).catch((err) => {
				this.$toast(err.response.data.error, "error");
			});
		}
	},
	computed: {
		slugSuggestion(){
			return this.newModpackForm.displayname.value.replace(/[^A-z|0-9|\s]/g, "").trim().replace(/\s/g, "-").toLowerCase();
		}
	},
	watch: {
		"newModpackForm.displayname.value": function(){
			this.newModpackForm.slug.value = this.slugSuggestion;
		}
	}
}
</script>

<style scoped>
	.placeholder {
		display: flex;
		width: 100%;
		height: auto;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
</style>