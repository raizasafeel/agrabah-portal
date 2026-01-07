<template>
	<header
		class="bg-white m-0 border-b border-gray-200 flex flex-row justify-between items-center px-4 md:px-6 lg:px-12 py-3 md:py-4"
	>
		<RouterLink to="/">
			<h1 class="text-base md:text-lg font-semibold text-gray-900">Government of Agrabah</h1>
		</RouterLink>
		<HeaderAvatar />
	</header>
</template>

<script setup>
import { RouterLink } from "vue-router";

import HeaderAvatar from "./HeaderAvatar.vue";
</script>
