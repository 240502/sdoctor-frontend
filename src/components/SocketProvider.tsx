import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import {
    getSocket,
    connectSocket,
    disconnectSocket,
    joinRoom,
} from '../socket';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        connectSocket();
        const socket = getSocket();

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });
        socket.on('connect_error', (err) => {
            console.error('Socket connect_error:', err.message, err);
        });
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            console.log('SocketProvider cleanup');
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            disconnectSocket();
        };
    }, []); // Không phụ thuộc userId để tránh reconnect

    // Join room khi userId thay đổi

    return <>{children}</>;
};
