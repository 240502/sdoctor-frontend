import { io, Socket } from 'socket.io-client';
import { baseURL } from './constants/api';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(baseURL, {
            withCredentials: true, // Gửi cookie (accessToken, refreshToken, _csrf)
            autoConnect: false, // Không tự động kết nối
        });
        socket.on('connect', () => {
            console.log('Socket connected:', socket?.id);
        });
        socket.on('connect_error', (err) => {
            console.error('Connection Error:', err.message);
        });
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }
    return socket;
};

export const connectSocket = () => {
    const socket = getSocket();
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    const socket = getSocket();
    if (socket.connected) {
        socket.disconnect();
    }
};

export const joinRoom = (userId: number, roomName: string) => {
    const socket = getSocket();
    if (socket.connected) {
        socket.emit('joinRoom', { userId, roomName });
    }
};
