<template>
	<Dialog
		v-model="show"
		:options="{
			title: `New ${serviceType} Connection Request`,
			size: 'lg',
		}"
	>
		<template #body-content>
			<form @submit.prevent="handleSubmit" class="space-y-6">
				<FormControl label="Service Type" disabled :modelValue="serviceType" />

				<FormControl label="Subject" v-model="formData.subject" required />

				<FormControl
					type="textarea"
					label="Description"
					v-model="formData.description"
					required
				/>

				<FormControl
					label="Phone Number"
					v-model="formData.phone"
					type="tel"
					required
					placeholder="Enter your phone number"
				/>

				<FormControl
					label="Address"
					v-model="formData.address"
					type="textarea"
					required
					placeholder="Enter your address"
				/>

				<div class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
					<Button label="Cancel" @click="closeDialog" />
					<Button
						label="Submit Request"
						variant="solid"
						:loading="submitResource.loading"
						type="submit"
					/>
				</div>
			</form>
		</template>
	</Dialog>
</template>

<script setup>
import { Button, Dialog, FormControl, createResource } from "frappe-ui"
import { computed, ref, watch } from "vue"
import { session } from "../data/session"

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	serviceType: {
		type: String,
		required: true,
		validator: (value) => ["Electricity", "Water", "Gas"].includes(value),
	},
})

const emit = defineEmits(["update:modelValue", "success"])

const show = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
})

const formData = ref({
	subject: "",
	description: "",
	phone: "",
	address: "",
})

// have a default subject, description
watch(
	() => props.serviceType,
	(newType) => {
		formData.value.subject = `New ${newType} Connection Request`
		formData.value.description = `I would like to request a new ${newType} connection. Please process my application.`
	},
	{ immediate: true },
)

const submitResource = createResource({
	url: "frappe.client.insert",
	onSuccess: (data) => {
		emit("success", data)
		closeDialog()
		// Reset form
		formData.value = {
			subject: `New ${props.serviceType} Connection Request`,
			description: `I would like to request a new ${props.serviceType} connection. Please process my application.`,
			phone: "",
			address: "",
		}
	},
})

const handleSubmit = () => {
	const doc = {
		doctype: "Service Request",
		customer: session.user,
		request_type: "New Connection",
		service_type: props.serviceType,
		subject: formData.value.subject,
		description: formData.value.description,
		phone: formData.value.phone,
		address: formData.value.address,
	}

	submitResource.submit({
		doc: JSON.stringify(doc),
	})
}

const closeDialog = () => {
	show.value = false
}
</script>
