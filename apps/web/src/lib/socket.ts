import { io, Socket } from "socket.io-client"

let socket: Socket | null = null;

export function getSocket() {
	if (!socket) {
		socket = io(process.env.NEXT_PUBLIC_API_URL!, {
			withCredentials: true,
			transports: ["websocket"],
			reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
		});
	}

	return socket;
}