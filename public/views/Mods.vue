<template>
	<div>
		<h1>Mods</h1>
		<div class="mods" v-if="mods.length > 0">

		</div>
		<div class="placeholder" v-else>
		</div>
		<!-- Curseforge Add Mod -->
		<i-modal v-model="modals.curseforge">
			
		</i-modal>
	</div>
</template>
<script>
export default {
	data(){
		return {
			mods: [],
			modals: {
				curseforge: false,
				local: false
			}
		}
	}
}
</script>