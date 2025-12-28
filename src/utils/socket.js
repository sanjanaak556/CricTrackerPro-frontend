import { io } from "socket.io-client";

// Socket URL from env (Render / local)
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

// Connection status tracking
let isConnected = false;
let connectionListeners = [];

export const getConnectionStatus = () => isConnected;

export const addConnectionListener = (callback) => {
  connectionListeners.push(callback);
  // Return cleanup function
  return () => {
    connectionListeners = connectionListeners.filter(listener => listener !== callback);
  };
};

const notifyConnectionListeners = (connected) => {
  isConnected = connected;
  connectionListeners.forEach(callback => callback(connected));
};

// Monitor connection status
socket.on("connect", () => {
  console.log("🔗 Socket connected:", socket.id);
  notifyConnectionListeners(true);
});

socket.on("disconnect", () => {
  console.log("🔌 Socket disconnected");
  notifyConnectionListeners(false);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
  notifyConnectionListeners(false);
});
