<template>
	<div>
		<h1>{{ mod.pretty_name }}</h1>
	</div>
</template>

<script>
import axios from "axios";

export default {
	props: ["mod"]
}
</script>