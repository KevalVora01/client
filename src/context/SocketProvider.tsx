import { useEffect, useState, useRef, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import { getAccessToken } from "../config/api";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const retries = useRef(0);

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const connect = () => {
      const token = getAccessToken();
      if (!token) {
        console.log("[SocketProvider] No token yet, retrying in 500ms...");
        if (retries.current < 10) {
          retries.current++;
          setTimeout(connect, 500);
        }
        return;
      }

      retries.current = 0;
      console.log("[SocketProvider] Connecting socket...");

      const s = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token },
      });

      s.on("connect", () => {
        console.log("[SocketProvider] Connected:", s.id);
        setSocket(s);
      });

      s.on("connect_error", (err) => {
        console.error("[SocketProvider] Error:", err.message);
      });

      s.on("disconnect", () => {
        console.log("[SocketProvider] Disconnected");
        setSocket(null);
      });

      return s;
    };

    const s = connect();

    return () => {
      if (s) {
        s.disconnect();
      }
      setSocket(null);
    };
  }, [isAuthenticated, isLoading]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};