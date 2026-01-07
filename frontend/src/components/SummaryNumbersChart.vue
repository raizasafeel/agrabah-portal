<template>
	<div>
		<h3 class="text-lg font-semibold my-4 md:my-6">Summary</h3>
		<div
			class="flex flex-col sm:flex-row gap-4 bg-white border border-gray-200 rounded-lg p-4 md:p-6"
		>
			<div
				v-for="chart in summaryNumbersCharts"
				:key="chart.title"
				class="flex items-center justify-between flex-col gap-2 w-full"
			>
				<p class="text-xl md:text-2xl font-bold mt-2">
					<span v-if="chart.prefix">{{ chart.prefix }}</span
					>{{ chart.value }}<span v-if="chart.suffix">{{ chart.suffix }}</span>
				</p>
				<p class="text-sm font-medium text-gray-600">{{ chart.title }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	summaryNumbersCharts: {
		type: Array,
		required: true,
	},
})
</script>
