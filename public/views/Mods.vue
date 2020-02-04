<template>
	<div>
		<h1>Mods</h1>
			<i-button variant="primary" @click="modals.generic = true">
				Add Mod
			</i-button>
			<i-button variant="twitch" @click="modals.curseforge = true">
				Add Mod from CurseForge
				<img src="/assets/curseforgeIcon.svg" style="margin-left: 3px;" height="21">
			</i-button>
		<div class="mods" v-if="mods.length > 0">
		</div>
		<div class="placeholder" v-else>
		</div>


		<!-- Modals -->
		<!-- Add Mod -->
		<i-modal v-model="modals.generic" :variant="this.$store.state.themeDark ? 'dark' : 'light'" size="lg" class="_text-dark">
			<template slot="header">
				Add Mod
			</template>
				<i-form>
					<i-form-group :inline="true" :readonly="modMenu.readonly">
						<i-form-label inline>Mod slug</i-form-label>
						<i-input v-model="modMenu.slug" required></i-input>
						<i-form-label inline class="_margin-left-1">Mod name</i-form-label>
						<i-input v-model="modMenu.name" required></i-input>
					</i-form-group>
					<i-form-group :readonly="modMenu.readonly" inline>
						<i-form-label>Author</i-form-label>
						<i-input v-model="modMenu.author" required></i-input>
					</i-form-group>
					<i-form-group :readonly="modMenu.readonly">
						<i-form-label>Description</i-form-label>
						<i-input v-model="modMenu.description"></i-input>
					</i-form-group>
					<i-form-group :readonly="modMenu.readonly">
						<i-form-label>Link</i-form-label>
						<i-input v-model="modMenu.link" type="url"></i-input>
					</i-form-group>
					<i-form-group>
						<i-form-label>Donate link</i-form-label>
						<i-input v-model="modMenu.donate"></i-input>
					</i-form-group>
					<i-form-group>
						<i-label>Client and/or Server side</i-label>
						<i-checkbox-group v-model="modMenu.side">
							<i-checkbox value="CLIENT">Client</i-checkbox>
							<i-checkbox value="SERVER">Server</i-checkbox>
						</i-checkbox-group>
					</i-form-group>
					<i-form-group :readonly="modMenu.readonly">
						<i-label>Type</i-label>
						<i-radio-button-group v-model="modMenu.type">
							<i-radio-button value="MOD">Mod</i-radio-button>
							<i-radio-button value="LIBRARY">Library</i-radio-button>
							<i-radio-button value="OTHER">Other</i-radio-button>
						</i-radio-button-group>
				</i-form>
			<template slot="footer">
				<i-button variant="primary">Add Mod</i-button>
			</template>
		</i-modal>

		<!-- Curseforge Add Mod -->
		<i-modal v-model="modals.curseforge" :variant="this.$store.state.themeDark ? 'dark' : 'light'" size="lg" class="_text-dark">
			<template slot="header">
				Add Mod from CurseForge
			</template>
			<CurseforgeSearch ref="cfSearch" @modSelect="addCurseMod($event)"></CurseforgeSearch>
		</i-modal>
	</div>
</template>
<script>
import CurseforgeSearch from '../components/CurseforgeSearch'

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
				readonly: false
			},
			modals: {
				curseforge: false,
				generic: false
			}
		}
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
			this.modMenu.readonly = true;
			this.modals.curseforge = false;
			this.modals.generic = true;
			setTimeout(this.$refs.cfSearch.clear, 500);
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
				readonly: false
			};
		}
	}
}
</script>