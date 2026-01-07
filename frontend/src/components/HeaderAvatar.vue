<template>
	<div class="relative" v-if="session.user">
		<Dropdown :options="dropdownOptions">
			<button class="cursor-pointer">
				<div
					v-if="isLoading"
					class="size-10 rounded-full bg-gray-200 animate-pulse"
				></div>
				<Avatar
					v-else
					:shape="'circle'"
					:image="userData?.user_image || null"
					:label="userData?.full_name || session.user"
					size="lg"
				/>
			</button>
		</Dropdown>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { Avatar, Dropdown } from "frappe-ui";

import { fetchUserData } from "../api";
import { session } from "../data/session";

const router = useRouter();

const { data: userData, isLoading } = useQuery({
	queryKey: ["user", session.user],
	queryFn: () => fetchUserData(session.user),
	enabled: computed(() => !!session.user),
});

const logout = () => {
	session.logout.submit();
};

const navigateToSupport = () => {
	router.push({ name: "Support" });
};

const navigateToFeedback = () => {
	router.push({ name: "Feedback" });
};

const dropdownOptions = [
	{
		label: "Support",
		icon: "help-circle",
		onClick: () => navigateToSupport(),
	},
	{
		label: "Feedback",
		icon: "message-circle",
		onClick: () => navigateToFeedback(),
	},
	{
		label: "Logout",
		icon: "log-out",
		theme: "red",
		onClick: () => logout(),
	},
];
</script>
