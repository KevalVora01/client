import { io, Socket } from "socket.io-client";

export const SOCKET_EVENTS = {
  NOTICE_NEW: "notice:new",
  COMPLAINT_NEW: "complaint:new",
  COMPLAINT_STATUS_UPDATED: "complaint:statusUpdated",
  MESSAGE_NEW: "message:new",
  NOTIFICATION_NEW: "notification:new",
  VISITOR_UPDATED: "visitor:updated",
} as const;

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