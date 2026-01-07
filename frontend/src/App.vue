<template>
	<div class="min-h-screen flex flex-col bg-gray-50">
		<PageHeader />
		<RouterView />
	</div>
</template>

<script setup>
import { RouterView } from "vue-router"
import PageHeader from "./components/PageHeader.vue"
</script>
