<template>
	<div>
		<div class="mods" v-if="mods.length > 0">
		<h1>Mods</h1>
			<i-button variant="primary" @click="modals.generic = true">
				Add Mod
			</i-button>
			<i-button variant="twitch" @click="modals.curseforge = true">
				Add Mod from CurseForge
				<img src="/assets/curseforgeIcon.svg" style="margin-left: 3px;" height="21">
			</i-button>
			<i-container>
				<i-row>
					<i-column>
						<i-table striped responsive bordered :variant="this.$store.state.themeDark ? 'dark' : 'light'" class="_margin-1">
							<thead>
								<tr>
									<th>#</th>
									<th>Slug</th>
									<th>Name</th>
									<th>Author</th>
									<th>Added</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="mod in mods" :key="mod.id">
									<td>{{mod.id}}</td>
									<td>{{mod.name}}</td>
									<td>{{mod.pretty_name}}</td>
									<td>{{mod.author}}</td>
									<td>{{new Date(mod.created).toDateString()}}</td>
									<td>
										<i-button :variant="mod.curseforge ? 'twitch' : 'secondary'" :to="'/mods/' + mod.name">Select</i-button>
									</td>
								</tr>
							</tbody>
						</i-table>
					</i-column>
				</i-row>
			</i-container>
		</div>
		<div class="placeholder" v-else>
			<div class="_display-flex _justify-content-center">
				<div class="_text-center _margin-2">
					<h1 class="_margin-0">You got no mods!</h1>
					<p class="_margin-0">So go ahead and add some!</p>

					<div class="_margin-1">
						<i-button variant="primary" @click="modals.generic = true" class="_display-block" block>
							Add Mod
						</i-button>
						<i-button variant="twitch" @click="modals.curseforge = true" class="_display-block" block>
							Add Mod from CurseForge
							<img src="/assets/curseforgeIcon.svg" style="margin-left: 3px;" height="21">
						</i-button>
					</div>
				</div>
			</div>
		</div>


		<!-- Modals -->
		<!-- Add Mod -->
		<i-modal v-model="modals.generic" :variant="this.$store.state.themeDark ? 'dark' : 'light'" size="lg" class="_text-dark">
			<template slot="header">
				Add Mod
			</template>
				<i-form>
					<i-form-group :inline="true" :readonly="modMenu.curse">
						<i-form-label inline>Mod slug</i-form-label>
						<i-input v-model="modMenu.slug" required></i-input>
						<i-form-label inline class="_margin-left-1">Mod name</i-form-label>
						<i-input v-model="modMenu.name" required></i-input>
					</i-form-group>
					<i-form-group :readonly="modMenu.curse" inline>
						<i-form-label>Author</i-form-label>
						<i-input v-model="modMenu.author" required></i-input>
					</i-form-group>
					<i-form-group :readonly="modMenu.curse">
						<i-form-label>Description</i-form-label>
						<i-input v-model="modMenu.description"></i-input>
					</i-form-group>
					<i-form-group :readonly="modMenu.curse">
						<i-form-label>Link</i-form-label>
						<i-input v-model="modMenu.link" type="url"></i-input>
					</i-form-group>
					<i-form-group>
						<i-form-label>Donate link</i-form-label>
						<i-input v-model="modMenu.donate"></i-input>
					</i-form-group>
					<i-form-group>
						<i-form-label>Client and/or Server side</i-form-label>
						<i-checkbox-group v-model="modMenu.side">
							<i-checkbox value="CLIENT">Client</i-checkbox>
							<i-checkbox value="SERVER">Server</i-checkbox>
						</i-checkbox-group>
					</i-form-group>
					<i-form-group :readonly="modMenu.curse">
						<i-form-label>Type</i-form-label>
						<i-radio-button-group v-model="modMenu.type">
							<i-radio-button value="MOD">Mod</i-radio-button>
							<i-radio-button value="LIBRARY">Library</i-radio-button>
							<i-radio-button value="OTHER">Other</i-radio-button>
						</i-radio-button-group>
				</i-form>
			<template slot="footer">
				<i-button variant="primary" @click="addMod()">Add Mod</i-button>
			</template>
		</i-modal>

		<!-- Curseforge Add Mod -->
		<i-modal v-model="modals.curseforge" :variant="this.$store.state.themeDark ? 'dark' : 'light'" size="lg" class="_text-dark">
			<template slot="header">
				Add Mod from CurseForge
			</template>
			<CurseforgeSearch ref="cfSearch" @modSelect="addCurseMod($event)"></CurseforgeSearch>
		</i-modal>

		<!-- Mod Modal -->
		<i-modal v-model="modals.modModal" :variant="this.$store.state.themeDark ? 'dark' : 'light'" size="lg" class="_text-dark" @hide="$router.push('/mods')">
			<template slot="header">{{selectedMod.pretty_name}}</template>
			<h4>Builds</h4>
			<template slot="footer">
				<i-button variant="danger">Delete</i-button>
				<i-button variant="edit">Edit</i-button>
			</template>
		</i-modal>
	</div>
</template>
<script>
import CurseforgeSearch from '../components/CurseforgeSearch';
import axios from "axios";

export default {
	components: {CurseforgeSearch},
	data(){
		return {
			mods: [],
			modMenu: {
				slug: "",
				name: "",
				author: "",
				description: "",
				link: "",
				donate: "",
				type: "MOD",
				side: ["CLIENT", "SERVER"],
				curse: false
			},
			modals: {
				curseforge: false,
				generic: false,
				modModal: this.$route.params.hasOwnProperty("mod")
			},
			fetchedBuilds: {}
		}
	},
	beforeMount(){
		this.fetchMods()
	},
	methods: {
		addCurseMod(mod){
			this.modMenu.slug = mod.key;
			this.modMenu.name = mod.name;
			this.modMenu.author = mod.owner;
			this.modMenu.description = mod.blurb;
			this.modMenu.link = mod.url;
			this.modMenu.type = "MOD";
			this.modMenu.side = ["CLIENT", "SERVER"];
			this.modMenu.curse = true;
			this.modals.curseforge = false;
			this.modals.generic = true;
			setTimeout(this.$refs.cfSearch.clear, 500);
		},
		addMod(){
			
			axios.post("/api/mods", this.modMenu).then((result) => {
				this.$toast("Mod added!", "success");
				this.modals.generic = false;
				this.fetchMods();
			}).catch((err) => {
				this.$toast(err.response.data.error, "error", 5000);
			});
		},
		fetchMods(){
			axios.get("/api/mods").then((result) => {
				this.mods = result.data.result;
			}).catch((err) => {
				this.$toast("Oh oh! Error! qwq", "error");
			});
		},
		fetchBuilds(slug){
			axios.get(`/api/mods/${slug}/builds`).then((result) => {
				this.fetchedBuilds[slug] = result.data;
			}).catch((err) => {
				this.$toast(err.response.data.error, "error");
			})
		}
	},
	computed: {
		modsObject(){
			if(this.mods.length == 0) return {};
			let obj = {};
			for(let mod of this.mods){
					obj[mod.name] = mod;
			}
			return obj;
		},
		selectedMod(){
			if(this.$route.params.hasOwnProperty("mod"))
				return this.modsObject[this.$route.params.mod];
			return {};
		}
	},
	watch: {
		"modals.generic": function(){
			if(!this.modals.generic)
				this.modMenu = {
				slug: "",
				name: "",
				author: "",
				description: "",
				link: "",
				donate: "",
				type: "MOD",
				side: ["CLIENT", "SERVER"],
				curse: false
			};
		},
		"$route": function(){
			this.modals.modModal = this.$route.params.hasOwnProperty("mod");
			if(this.modals.modModal) this.fetchBuilds(this.$route.params.mod);
		}
	}
}
</script>