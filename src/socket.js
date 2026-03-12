// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://server-y72m.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
