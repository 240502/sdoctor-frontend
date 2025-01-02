// src/socket.ts
import { io, Socket } from 'socket.io-client';
import { nestJsServiceUrl } from './constants/api';
const socket: Socket = io(nestJsServiceUrl);

socket.on('connect', () => {
    console.log('Connected to Socket.io server');
});

// Xử lý kết nối lỗi
socket.on('connect_error', (err) => {
    console.error('Connection Error:', err.message);
});
export default socket;
