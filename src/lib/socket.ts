"use client";

import { io, Socket } from "socket.io-client";

import { getCachedAccessToken } from "./auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let socket: Socket | null = null;
let socketPromise: Promise<Socket | null> | null = null;

function createSocket(token: string): Socket | null {
  if (!API_URL) {
    return null;
  }

  return io(API_URL, {
    auth: {
      token,
    },
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });
}

export async function getSocket(): Promise<Socket | null> {
  if (socket) {
    return socket;
  }

  if (socketPromise) {
    return socketPromise;
  }

  socketPromise = (async () => {
    const token = await getCachedAccessToken();

    if (!token) {
      return null;
    }

    socket = createSocket(token);

    return socket;
  })();

  try {
    return await socketPromise;
  } finally {
    socketPromise = null;
  }
}

export function disconnectSocket(): void {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}