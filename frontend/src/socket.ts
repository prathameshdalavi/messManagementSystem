import { io } from "socket.io-client";

// Connect to backend WebSocket server (same port as API)
export const socket = io("http://localhost:3000"); // Replace with your server URL in prod
