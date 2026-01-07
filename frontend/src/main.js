import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";
import { initSocket } from "./socket";

import {
	Alert,
	Badge,
	Button,
	Card,
	Dialog,
	ErrorMessage,
	FormControl,
	Input,
	TextInput,
	frappeRequest,
	pageMetaPlugin,
	resourcesPlugin,
	setConfig,
} from "frappe-ui";

import "./index.css";

const globalComponents = {
	Button,
	Card,
	TextInput,
	Input,
	FormControl,
	ErrorMessage,
	Dialog,
	Alert,
	Badge,
};

const app = createApp(App);

setConfig("resourceFetcher", frappeRequest);

// Setup TanStack Query
app.use(VueQueryPlugin, {
	queryClientConfig: {
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: 1,
				staleTime: 30000, // 30 seconds
			},
		},
	},
});

app.use(router);
app.use(resourcesPlugin);
app.use(pageMetaPlugin);

const socket = initSocket();
app.config.globalProperties.$socket = socket;

for (const key in globalComponents) {
	app.component(key, globalComponents[key]);
}

app.mount("#app");
