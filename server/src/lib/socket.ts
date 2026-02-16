import { Server } from "socket.io";
import http from "http";
import { verifyAccessToken } from "./jwtToken";

let io: Server | null = null;

const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {} as Record<string, string>);
};

export const initSocket = (server: http.Server, allowedOrigins: string[]) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = parseCookies(socket.request.headers.cookie);
    const token = cookies.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const payload = verifyAccessToken(token) as { id: string; role: string };
      if (!payload?.id || payload.role !== "user") {
        return next(new Error("Unauthorized"));
      }
      socket.data.userId = payload.id;
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string | undefined;
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
