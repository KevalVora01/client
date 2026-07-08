import { useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import { getAccessToken } from "../config/api";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      setSocket(s);
    });

    s.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocket(null);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, isLoading]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};