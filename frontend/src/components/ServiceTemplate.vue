<template>
	<div class="min-h-[400px]">
		<div v-if="isLoading" class="flex items-center justify-center">
			<div
				class="animate-spin rounded-full border-b-2 border-gray-400 mx-auto mb-4 h-8 w-8 md:h-12 md:w-12 lg:h-16 lg:w-16"
			></div>
		</div>

		<div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
			<Alert
				:title="`Error Loading ${serviceType} Bills`"
				:description="
					error.message || `Failed to load ${serviceType.toLowerCase()} bills. Please try again.`
				"
			>
				<template #actions>
					<Button label="Retry" @click="refetch" />
				</template>
			</Alert>
		</div>

		<div v-else>
			<SummaryNumbersChart :summaryNumbersCharts="summaryNumbersCharts" />
			<DataTable
				:rows="bills || []"
				:onNewConnection="openNewConnectionDialog"
				@refresh="refetch"
			/>
		</div>

		<NewConnectionForm
			v-model="showNewConnectionDialog"
			:serviceType="serviceType"
			@success="handleNewConnectionSuccess"
		/>
	</div>
</template>

<script setup>
import { useQuery } from "@tanstack/vue-query"
import { Alert, Button } from "frappe-ui"
import { ref } from "vue"

import { fetchBills } from "../api"
import { useBillSummary } from "../composables/useBillSummary"
import DataTable from "./DataTable.vue"
import NewConnectionForm from "./NewConnectionForm.vue"
import SummaryNumbersChart from "./SummaryNumbersChart.vue"

const props = defineProps({
	serviceType: {
		type: String,
		required: true,
		validator: (value) => ["Electricity", "Water", "Gas"].includes(value),
	},
})

const showNewConnectionDialog = ref(false)

const {
	data: bills,
	isLoading,
	error,
	refetch,
} = useQuery({
	queryKey: ["bills", props.serviceType],
	queryFn: () => fetchBills(props.serviceType),
})

const summaryNumbersCharts = useBillSummary(bills)

const openNewConnectionDialog = () => {
	showNewConnectionDialog.value = true
}

const handleNewConnectionSuccess = () => {
	refetch()
}
</script>

