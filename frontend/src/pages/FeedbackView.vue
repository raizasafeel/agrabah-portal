<template>
	<div class="mt-6 md:mt-12 max-w-3xl mx-auto px-4 sm:px-6">
		<div class="mb-6 md:mb-8">
			<h1 class="text-2xl md:text-3xl font-bold text-gray-900">Submit Feedback</h1>
			<p class="text-gray-600 mt-2 text-sm md:text-base">
				We value your feedback! Let us know how we can improve.
			</p>
		</div>

		<Card class="p-4 md:p-6">
			<Alert
				v-if="isError"
				title="Error Submitting Feedback"
				:description="error?.message || 'Failed to submit feedback. Please try again.'"
				class="mb-4"
			/>

			<form @submit.prevent="handleSubmit" class="space-y-6">
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
					placeholder="Brief description of your feedback"
					:disabled="isPending"
				/>

				<FormControl
					type="textarea"
					label="Description"
					v-model="formData.description"
					required
					placeholder="Share your feedback with us"
					:disabled="isPending"
				/>

				<div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
					<Button label="Cancel" @click="goBack" :disabled="isPending" />
					<Button
						label="Submit Feedback"
						variant="solid"
						:loading="isPending"
						type="submit"
					/>
				</div>
			</form>
		</Card>

		<div v-if="showSuccess" class="mt-4">
			<Alert
				title="Feedback Submitted Successfully"
				description="Thank you for your feedback! We appreciate your input."
			/>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { Alert, Button, Card, FormControl } from "frappe-ui";

import { createServiceRequest } from "../api";
import { SERVICE_TYPES_WITH_GENERAL } from "../constants";
import { session } from "../data/session";

const router = useRouter();

const formData = ref({
	service_type: "",
	subject: "",
	description: "",
});

const showSuccess = ref(false);

const { mutate, isPending, isError, error } = useMutation({
	mutationFn: createServiceRequest,
	onSuccess: (data) => {
		showSuccess.value = true;

		// Reset form
		formData.value = {
			service_type: "",
			subject: "",
			description: "",
		};

		// Redirect to home after 2 seconds
		setTimeout(() => {
			router.push({ name: "Home" });
		}, 2000);
	},
});

const handleSubmit = () => {
	mutate({
		customer: session.user,
		request_type: "Feedback",
		service_type: formData.value.service_type,
		subject: formData.value.subject,
		description: formData.value.description,
	});
};

const goBack = () => {
	router.push({ name: "Home" });
};
</script>
