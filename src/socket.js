import { io } from "socket.io-client";

const SOCKET_URL = "https://server-y72m.onrender.com";
// import.meta.env.VITE_API_URL ||

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

export default socket;
