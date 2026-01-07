<template>
	<div class="main-container">
		<div class="mt-6 md:mt-12 space-y-2 min-h-[15vh] md:min-h-[20vh]">
			<p class="text-xl md:text-2xl font-bold text-gray-900">Hi {{ session.user }}</p>
			<p class="text-base md:text-lg text-gray-600">Welcome to the GoA Services Portal</p>
		</div>
		<div id="tabs">
			<Tabs :tabs="tabs">
				<template #tab-panel="{ tab }">
					<ServiceView :serviceType="tab.value" />
				</template>
			</Tabs>
		</div>
	</div>
</template>

<script setup>
import { Tabs } from "frappe-ui";
import { session } from "../data/session";
import ServiceView from "../components/ServiceTemplate.vue";

const tabs = [
	{
		label: "⛽ Gas",
    value: "Gas",
	},
	{
		label: "🚰 Water",
    value: "Water",
	},
	{
		label: "🔌 Electricity",
    value: "Electricity",
	},
];
</script>
