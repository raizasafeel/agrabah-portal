<template>
	<div class="main-container">
		<div class="mt-6 md:mt-12 space-y-2 min-h-[15vh] md:min-h-[20vh]">
			<p class="text-xl md:text-2xl font-bold text-gray-900">Hi {{ session.user }}</p>
			<p class="text-base md:text-lg text-gray-600">Welcome to the GoA Services Portal</p>
		</div>
			<Tabs :tabs="tabs" v-model="activeTabIndex">
				<template #tab-panel="{ tab }">
					<ServiceView :serviceType="tab.value" />
				</template>
			</Tabs>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { Tabs } from "frappe-ui"
import ServiceView from "../components/ServiceTemplate.vue"
import { session } from "../data/session"

const router = useRouter()
const route = useRoute()

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
]

const getTabIndexFromQuery = (tabName) => {
	if (!tabName) return 0
	const index = tabs.findIndex(t => t.value === tabName)
	return index >= 0 ? index : 0
}

const getTabNameFromIndex = (index) => {
	return tabs[index]?.value || tabs[0].value
}

const activeTabIndex = ref(getTabIndexFromQuery(route.query.tab))

watch(activeTabIndex, (newIndex) => {
	const tabName = getTabNameFromIndex(newIndex)
	if (tabName !== route.query.tab) {
		router.push({
			query: { ...route.query, tab: tabName }
		})
	}
})

watch(() => route.query.tab, (newTab) => {
	const newIndex = getTabIndexFromQuery(newTab)
	if (newIndex !== activeTabIndex.value) {
		activeTabIndex.value = newIndex
	}
})

onMounted(() => {
	if (!route.query.tab) {
		const tabName = getTabNameFromIndex(activeTabIndex.value)
		router.replace({
			query: { ...route.query, tab: tabName }
		})
	}
})
</script>
