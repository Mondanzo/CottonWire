<template>
	<img :src="'https://avatars.dicebear.com/v2/jdenticon/' + hash + '.svg'" :width="size" :height="size">
</template>
<style scoped>
	img {
		border-radius: 500px;
		border: solid 1px #343a40;
		background-color: #e9ecef;
	}
</style>
<script>
export default {
	props: {
		"hash": {
			"type": String,
			"required": true
		},
		"size": {
			"type": Number,
			"default": 64
		}
	}
}
</script>