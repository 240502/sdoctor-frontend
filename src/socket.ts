// src/socket.ts
import { io, Socket } from 'socket.io-client';
import { baseURL } from './constants/api';
let socket: Socket | null = null;

if (!socket) {
    socket = io(baseURL); // Khởi tạo chỉ một lần
}

// Trạng thái đã join room
let hasJoinedRoom = false;

// Kết nối tới server
socket.on('connect', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (currentUser?.userId && !hasJoinedRoom) {
        hasJoinedRoom = true; // Đánh dấu đã tham gia room
        console.log('join room');
        socket.emit('joinRoom', { userId: currentUser.userId });
    }
    console.log('Connected to Socket.io server');
});

// Xử lý kết nối lỗi
socket.on('connect_error', (err) => {
    console.error('Connection Error:', err.message);
});

// Xử lý disconnect
socket.on('disconnect', () => {
    hasJoinedRoom = false; // Reset trạng thái khi bị ngắt kết nối
});

export default socket;
