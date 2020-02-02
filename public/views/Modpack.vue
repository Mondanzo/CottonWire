<template>
	<div v-if="modpack">
		<h2>
			{{ modpack.display_name }}
			<img :src="modpack.icon" :alt="modpack.name">
		</h2>
		<i-container>
			<i-row>
				<i-column>
					<h4>Upload icon</h4>
					<input type="file" ref="imgIcon" accept="image/png, image/jpeg">
					<div class="_margin-top-1">
						<img :src="modpack.icon" class="_rounded _border-color-gray-80 _border" width=50 height="50">
					</div>
					<h4>Upload logo</h4>
					<input type="file" ref="imgLogo" accept="image/png, image/jpeg">
					<div class="_margin-top-1">
						<img :src="modpack.logo" class="_rounded _border-color-gray-80 _border" height=110 width=185>
					</div>
					<h4>Upload background</h4>
					<input type="file" ref="imgBg" accept="image/png, image/jpeg">
					<div class="_margin-top-1">
						<img :src="modpack.background" class="_rounded _border-color-gray-80 _border" height=200 width=300>
					</div>
					<i-button variant="success" class="_margin-top-2">Update Modpack</i-button>
					<h4 class="_text-danger">Danger Zone</h4>
					<p class="_text-danger">Yeah that's the only button. Got a problem with that?</p>
					<i-button variant="danger" @click="deleteModpack()">Delete Modpack</i-button>
				</i-column>
				<i-column>
					<h4>Change Name</h4>
					<p>Change the display name of the Modpack</p>
					<i-input :value="modpack.display_name" name="display_name"></i-input>
					<h4>Change Slug</h4>
					<p>Haha just kidding fuck you you can't change it</p>
					<i-input :value="modpack.name" name="name" readonly></i-input>
				</i-column>
			</i-row>
		</i-container>
	</div>
	<div v-else>
		<h2>Loading?</h2>
	</div>
</template>

<script>
import axios from "axios";


export default {
	data(){
		return {
			modpack: null
		}
	},
	methods: {
		setModpack(modpack){
			this.modpack = modpack;
			if(this.modpack.error){
				this.$toast(this.modpack.error, "error");
				this.$emit("updated");
				this.$router.push("/modpacks");
			}
		},
		updateModpack(){

		},
		deleteModpack(){
			axios.delete("/api/modpack/" + this.modpack.name).then((result) => {
				this.$emit("updated");
				this.$router.push("/modpacks");
			}).catch((error) => {
				this.$alert(error, "an error occured!", "error");
			});
		}
	},
	beforeRouteEnter(to, from, next){
		axios.get("/api/modpack/" + to.params.modpack).then((result) => {
			next(vm => vm.setModpack(result.data));
		}).catch((err) => {
			next();
		});
	},
	beforeRouteUpdate(to, from, next){
		this.modpack = null;
		axios.get("/api/modpack/" + to.params.modpack).then((result) => {
			this.setModpack(result.data);
			next();
		}).catch((err) => {
			next();
		});
	}
}
</script>