<template>
	<div class="mt-6 md:mt-12 max-w-3xl mx-auto px-4 sm:px-6">
		<div class="mb-6 md:mb-8">
			<h1 class="text-2xl md:text-3xl font-bold text-gray-900">Submit Support Request</h1>
			<p class="text-gray-600 mt-2 text-sm md:text-base">
				Need help? Fill out the form below and we'll get back to you.
			</p>
		</div>

		<Card class="p-4 md:p-6">
			<Alert
				v-if="isError"
				title="Error Submitting Request"
				:description="
					error?.message || 'Failed to submit support request. Please try again.'
				"
				class="mb-4"
			/>

			<form @submit.prevent="handleSubmit" class="space-y-6">
				<FormControl
					label="Request Type"
					type="select"
					v-model="formData.request_type"
					:options="REQUEST_TYPES"
					required
					:disabled="isPending"
				/>

				<FormControl
					label="Service Type"
					type="select"
					v-model="formData.service_type"
					:options="SERVICE_TYPES_WITH_GENERAL"
					required
					:disabled="isPending"
				/>

				<FormControl
					label="Subject"
					v-model="formData.subject"
					required
					placeholder="Brief description of your issue"
					:disabled="isPending"
				/>

				<FormControl
					type="textarea"
					label="Description"
					v-model="formData.description"
					required
					placeholder="Provide detailed information about your issue"
					:disabled="isPending"
				/>

				<div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
					<Button label="Cancel" @click="goBack" :disabled="isPending" />
					<Button
						label="Submit Request"
						variant="solid"
						:loading="isPending"
						type="submit"
					/>
				</div>
			</form>
		</Card>

		<div v-if="showSuccess" class="mt-4">
			<Alert
				title="Request Submitted Successfully"
				description="Your support request has been submitted. We'll get back to you soon."
			/>
		</div>
	</div>
</template>

<script setup>
import { useMutation } from "@tanstack/vue-query"
import { Alert, Button, Card, FormControl } from "frappe-ui"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { createServiceRequest } from "../api"
import { REQUEST_TYPES, SERVICE_TYPES_WITH_GENERAL } from "../constants"
import { session } from "../data/session"

const router = useRouter()

const formData = ref({
	request_type: "",
	service_type: "",
	subject: "",
	description: "",
})

const showSuccess = ref(false)

const { mutate, isPending, isError, error } = useMutation({
	mutationFn: createServiceRequest,
	onSuccess: (data) => {
		showSuccess.value = true

		formData.value = {
			request_type: "",
			service_type: "",
			subject: "",
			description: "",
		}

		setTimeout(() => {
			router.push({ name: "Home" })
		}, 2000)
	},
})

const handleSubmit = () => {
	mutate({
		customer: session.user,
		request_type: formData.value.request_type,
		service_type: formData.value.service_type,
		subject: formData.value.subject,
		description: formData.value.description,
	})
}

const goBack = () => {
	router.push({ name: "Home" })
}
</script>
