<template>
	<i-container>
		<i-row class="_margin-y-1">
			<i-column>
				<h1 class="_margin-0">Mods</h1>
			</i-column>
			<i-column>
				<i-button-group>
					<i-button @click="pageBack()" :disabled="!(curseforge.pageIndex > 1)" :variant="this.$store.state.themeDark ? 'dark' : 'light'">Prev</i-button>
					<i-button @click="pageForward()" :disabled="!(curseforge.fetchedMods.length > 4)" :variant="this.$store.state.themeDark ? 'dark' : 'light'">Next</i-button>
				</i-button-group>
			</i-column>
		</i-row>

		<i-row>
			<i-column>
				<i-input type="search" v-model="curseforge.searchTerm" @keyup.enter="curseforge.pageIndex = 1; fetchCurseforgeMod()">
					<i slot="suffix" @click="curseforge.pageIndex = 1; fetchCurseforgeMod()"><i-icon icon="search"></i-icon></i>
				</i-input>
			</i-column>
		</i-row>
		<i-row class="_margin-top-1">
			<i-column>
				<i-collapsible  v-if="curseforge.fetchedMods.length > 0" :variant="this.$store.state.themeDark ? 'dark' : 'light'" style="max-height: 500px" class="_overflow-auto _position-relative">
					<div v-if="curseforge.loading" class="_overlay _display-flex _justify-content-center _align-items-center" style="background: #0008">
						<i-loader></i-loader>
					</div>
					<i-collapsible-item v-for="mod of curseforge.fetchedMods" :key="mod.key" :id="mod.key" :title="mod.name+' - '+mod.owner">
						<span>
							<i-badge v-for="(item, index) in mod.categories" :key="index" class="_margin-left-1 _margin-bottom-1" variant="twitch">
								{{item}}
							</i-badge>
						</span>
						<h5 class="_margin-0"><a :href="mod.url">{{mod.name}}</a> <small> by {{mod.owner}}</small></h5>
						<img :src="mod.logo" class="_margin-1 _rounded">
						<div class="cFdescription" v-html="mod.description">
						</div>
						<i-button variant="twitch" @click="$emit('modSelect', mod)">Select</i-button>
					</i-collapsible-item>
				</i-collapsible>
			</i-column>
		</i-row>
	</i-container>
</template>

<style>
.cFdescription {
	max-width: 100%;
}

.cFdescription img {
	height: auto;
	max-width: 100%;
}
</style>

<script>
import curseforge from "mc-curseforge-api";

export default {
	data(){
		return {
			curseforge: {
				searchTerm: "",
				pageIndex: 1,
				fetchedMods: [],
				loading: false
			}
		}
	},
	methods: {
		fetchCurseforgeMod(){
			let options = {
				"page_size": 5,
				"page_num": this.curseforge.pageIndex
			}
			this.curseforge.loading = true;
			if(this.curseforge.searchTerm.length)
				options["mod_name"] = this.curseforge.searchTerm;
			curseforge.getMods(options).then((mods) => {
				this.curseforge.loading = false;
				this.curseforge.fetchedMods = mods;
			})
		},
		pageForward(){
			this.curseforge.pageIndex++;
			this.fetchCurseforgeMod();
		},
		pageBack(){
			this.curseforge.pageIndex--;
			this.fetchCurseforgeMod();
		},
		clear(){
			this.curseforge.pageIndex = 0;
			this.curseforge.fetchedMods = [];
			this.curseforge.searchTerm = "";
		}
	}
}
</script>