<template>
	<div class="flex items-center justify-center p-4 sm:p-6 md:p-8">
		<div class="w-full max-w-md">
			<div class="text-center mb-6 md:mb-8">
				<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Government of Agrabah</h1>
				<p class="text-base md:text-lg text-gray-600">Services Portal</p>
			</div>

			<div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
				<h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 text-center">Welcome Back</h2>
				<p class="text-sm text-gray-600 mb-6 text-center">Please login to continue</p>

				<form class="flex flex-col space-y-2 w-full" @submit.prevent="login">
					<Input
						v-model="email"
						required
						name="email"
						type="text"
						placeholder="johndoe@email.com"
						label="User ID"
					/>
					<Input
						v-model="password"
						required
						name="password"
						type="password"
						placeholder="••••••"
						label="Password"
					/>
					<Button type="submit" :loading="session.login.loading" variant="solid"
						>Login</Button
					>
				</form>
			</div>

			<div class="text-center mt-4 md:mt-6">
				<p class="text-sm text-gray-600">Need help? Contact support</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Button, Input } from "frappe-ui"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { session } from "../data/session"

const router = useRouter()
const email = ref("")
const password = ref("")

const login = () => {
	if (session.login.loading) {
		return
	}
	if (!session.user) {
		session.login.submit({
			email: email.value,
			password: password.value,
		})
	} else {
		router.push({ name: "Home" })
	}
}
</script>
