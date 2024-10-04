// src/socket.ts
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:400');

socket.on('connect', () => {
    console.log('Connected to Socket.io server');
});

// Xử lý kết nối lỗi
socket.on('connect_error', (err) => {
    console.error('Connection Error:', err.message);
});
export default socket;
