import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(accessToken: string): Socket {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_BASE_URL, {
    auth: { token: accessToken },
  });

  socket.on("connect", () => console.log("Socket connected:", socket?.id));
  socket.on("connect_error", (err) => console.error("Socket error:", err.message));

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}