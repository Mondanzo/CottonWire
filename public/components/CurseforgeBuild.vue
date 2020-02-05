<template>
	<i-container v-if="cfMod">
		<i-row>
				<i-column>
					<h2 class="_margin-0">{{cfMod.name}}</h2>
				</i-column>
				<i-column>
					<i-select v-model="cfFilter">
						<i-select-option :value="null" label="No version filter" selected></i-select-option>
						<i-select-option v-for="(v, i) in cfAvailabledVersions" :key="i" :value="v" :label="v"></i-select-option>
					</i-select>
				</i-column>
		</i-row>
		<i-row>
			<p class="_margin-0 _margin-left-1 _margin-bottom-1">{{cfMod.blurb}}</p>
		</i-row>
		<i-row>
			<i-column class="_overflow-auto _border-top _border-bottom _border-color-dark" style="max-height: 500px">
				<div class="build _background-gray-30 _padding-1 _margin-y-1 _margin-right-1 _rounded" v-for="build in filteredBuilds" :key="build.id">
					<h4>{{build.file_name}}</h4>
					<p><i-icon icon="chevron-down"></i-icon> {{build.downloads}} Downloads<i-badge class="_margin-left-1" v-for="(version, i) in build.minecraft_versions" :key="i">{{version}}</i-badge></p>
					<div class="dependencies" v-if="build.mod_dependencies.length > 0">
						Requires
						{{build.mod_dependencies.join(", ")}}
					</div>
					<i-button class="_margin-1" variant="twitch">Select version</i-button>
				</div>
			</i-column>
		</i-row>
	</i-container>
</template>

<script>

export default {
	components: {FormWizard, TabContent, CurseforgeSearch},
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
				side: ["CLIENT", "SERVER"]
			},
			modals: {
				curseforge: false,
				generic: false
			},
			cfMod: null,
			cfBuilds: [],
			cfSelectedBuild: null,
			cfFilter: null,
			cfAvailabledVersions: []
		}
	},
	computed: {
		filteredBuilds(){
			if(this.cfFilter !== null)
				return this.cfBuilds.filter(build => build.minecraft_versions.includes(this.cfFilter))
			else
				return this.cfBuilds;
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
			this.modals.curseforge = false;
			this.modals.generic = true;
			setTimeout(this.$refs.cfSearch.clear, 500);
		},
		setSelectedMod(mod){
			curseforge.getModFiles(mod.id).then((files) => {
				this.cfBuilds = files;
				this.cfAvailabledVersions = [];
				for(let b of this.cfBuilds){
					for(let ver of b.minecraft_versions)
						if(ver.startsWith("1") && !this.cfAvailabledVersions.includes(ver))
							this.cfAvailabledVersions.push(ver);
				}
				this.cfMod = mod;
				this.$refs.curseforgeWizard.nextTab();
				})
		},
		setSelectedBuild(build){
			this.cfSelectedBuild = build;
		}
	}
}
</script>