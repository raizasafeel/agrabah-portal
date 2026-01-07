
<template>
	<div class="mt-4 md:mt-6">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 my-4 md:my-6">
			<div class="flex justify-between items-center w-full">
        <h3 class="text-lg font-semibold">Bills</h3>
			<Button
				label="Download CSV"
				:disabled="!rows || rows.length === 0"
				@click="downloadCSV"
			/>
      </div>
      
		</div>
		<ListView
			:columns="columns"
			:rows="rows"
			:options="{
				selectable: state.selectable,
				showTooltip: state.showTooltip,
				resizeColumn: state.resizeColumn,
				emptyState: state.emptyState,
			}"
			row-key="bill_number"
		>
			<template #cell="{ item, row, column }">
				<Badge
					v-if="column.key === 'payment_status'"
					:label="item"
					:theme="item === 'Paid' ? 'green' : item === 'Unpaid' ? 'orange' : 'red'"
				/>

				<span
					v-else-if="column.key === 'units_consumed'"
					class="text-sm font-medium text-gray-600"
					>{{ item }} units</span
				>

				<span
					v-else-if="column.key === 'total_amount'"
					class="text-sm font-medium text-gray-600"
					>₹{{ item }}</span
				>

				<span
					v-else-if="column.key === 'rate_per_unit'"
					class="text-sm font-medium text-gray-600"
					>₹{{ item }}/unit</span
				>

				<Button
					v-else-if="column.key === 'action'"
					:label="row.payment_status === 'Paid' ? 'Download Invoice' : 'Pay Now'"
					:variant="row.payment_status === 'Paid' ? 'outline' : 'solid'"
					@click="
						() =>
							row.payment_status === 'Paid'
								? downloadInvoice(row.name)
								: openPayNowDialog(row)
					"
				/>

				<span class="text-sm font-medium text-gray-600" v-else>{{ item }}</span>
			</template>
		</ListView>

		<PayNowForm
			v-model="showPayNowDialog"
			:bill="selectedBill"
			@success="emit('refresh')"
		/>
	</div>
</template>

<script setup>
import { Badge, Button, ListView } from "frappe-ui"
import { reactive, ref } from "vue"

import PayNowForm from "./PayNowForm.vue"

const props = defineProps({
	rows: {
		type: Array,
		required: true,
	},
	onNewConnection: {
		type: Function,
		default: null,
	},
})

const emit = defineEmits(["refresh"])

const showPayNowDialog = ref(false)
const selectedBill = ref(null)

const state = reactive({
	selectable: false,
	showTooltip: true,
	resizeColumn: true,
	emptyState: {
		title: "No records found",
		description: "Apply a new connection",
		button: {
			label: "New Connection",
			variant: "solid",
			onClick: () => {
				if (props.onNewConnection) {
					props.onNewConnection()
				}
			},
		},
	},
})

const columns = [
	{
		label: "Bill Number",
		key: "bill_number",
	},
	{
		label: "Bill Date",
		key: "bill_date",
	},
	{
		label: "Due Date",
		key: "due_date",
	},
	{
		label: "Units Consumed",
		key: "units_consumed",
	},
	{
		label: "Rate per Unit",
		key: "rate_per_unit",
	},
	{
		label: "Total Amount",
		key: "total_amount",
	},
	{
		label: "Payment Status",
		key: "payment_status",
	},
	{
		label: "Action",
		key: "action",
	},
]

const openPayNowDialog = (bill) => {
	selectedBill.value = bill
	showPayNowDialog.value = true
}

const downloadInvoice = (billName) => {
	const baseUrl = window.location.origin
	const downloadUrl = `${baseUrl}/api/method/frappe.utils.print_format.download_pdf?doctype=Utility%20Bill&name=${billName}&format=Standard&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en&pdf_generator=wkhtmltopdf`
	window.open(downloadUrl)
}

const downloadCSV = () => {
	if (!props.rows || props.rows.length === 0) {
		return
	}

	const headers = [
		"Bill Number",
		"Bill Date",
		"Due Date",
		"Units Consumed",
		"Rate per Unit",
		"Total Amount",
		"Payment Status",
	]

	const csvRows = [
		headers.join(","),
		...props.rows.map((row) =>
			[
				row.bill_number || "",
				row.bill_date || "",
				row.due_date || "",
				row.units_consumed || "",
				row.rate_per_unit || "",
				row.total_amount || "",
				row.payment_status || "",
			]
				.map((value) => `"${value}"`)
				.join(","),
		),
	]

	const csvContent = csvRows.join("\n")

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
	const link = document.createElement("a")
	const url = URL.createObjectURL(blob)

	const date = new Date().toISOString().split("T")[0]
	const filename = `bills_${date}.csv`

	link.setAttribute("href", url)
	link.setAttribute("download", filename)
	link.style.visibility = "hidden"
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
</script>
  