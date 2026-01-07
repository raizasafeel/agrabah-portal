import { io } from "socket.io-client";
import { socketio_port } from "../../../../sites/common_site_config.json";

let socket = null;
export function initSocket() {
	const host = window.location.hostname;
	const port = `:${socketio_port}`;

	const url = `${window.location.protocol}//${host}${port}`;

	socket = io(url, {
		withCredentials: true,
		reconnectionAttempts: 5,
		transports: ["websocket", "polling"],
	});

	return socket;
}

export function useSocket() {
	return socket;
}
