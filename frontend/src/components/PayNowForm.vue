<template>
	<Dialog
		v-model="show"
		:options="{
			title: 'Pay Bill',
			size: 'lg',
		}"
	>
		<template #body-content>
			<div v-if="bill" class="space-y-4">
				<Alert
					v-if="isError"
					title="Payment Error"
					:description="error?.message || 'Failed to process payment. Please try again.'"
					class="mb-4"
				/>

				<div class="bg-gray-50 p-4 md:p-6 rounded-lg space-y-3">
					<div
						v-for="(detail, index) in billDetails"
						:key="detail.label"
						class="flex justify-between items-center text-sm text-gray-600"
					>
						<span class="">
							{{ detail.label }}:
						</span>
						<span class="font-medium text-gray-900">
							{{ detail.value }}
						</span>
					</div>
				</div>

				<form @submit.prevent="handlePayment" class="space-y-6 mt-6">
					<FormControl
						label="Payment Method"
						type="select"
						v-model="paymentMethod"
						:options="PAYMENT_METHODS"
						required
						:disabled="isPending"
					/>

					<div class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
						<Button label="Cancel" @click="closeDialog" :disabled="isPending" />
						<Button
							label="Proceed to Pay"
							variant="solid"
							:loading="isPending"
							type="submit"
						/>
					</div>
				</form>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { Alert, Button, Dialog, FormControl } from "frappe-ui"
import { computed, ref } from "vue"

import { processPayment } from "../api"
import { PAYMENT_METHODS } from "../constants"

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	bill: {
		type: Object,
		default: null,
	},
})

const emit = defineEmits(["update:modelValue", "success"])

const queryClient = useQueryClient()

const show = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
})

const paymentMethod = ref("")

const billDetails = computed(() => {
	if (!props.bill) return []

	return [
		{
			label: "Bill Number",
			value: props.bill.bill_number,
		},
		{
			label: "Bill Date",
			value: props.bill.bill_date,
		},
		{
			label: "Due Date",
			value: props.bill.due_date,
		},
		{
			label: "Units Consumed",
			value: `${props.bill.units_consumed} units`,
		},
		{
			label: "Total Amount",
			value: `₹${props.bill.total_amount}`,
		},
	]
})

const { mutate, isPending, isError, error } = useMutation({
	mutationFn: ({ billName, paymentMethod }) =>
		processPayment(billName, paymentMethod),
	onSuccess: (data) => {
		queryClient.invalidateQueries({ queryKey: ["bills"] })
		emit("success", data)
		closeDialog()
		paymentMethod.value = ""
	},
})

const handlePayment = () => {
	if (!props.bill || !paymentMethod.value) return

	mutate({
		billName: props.bill.name,
		paymentMethod: paymentMethod.value,
	})
}

const closeDialog = () => {
	show.value = false
}
</script>
