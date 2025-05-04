import { useEffect } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '../socket';
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        connectSocket();
        const socket = getSocket();
        return () => {
            console.log('SocketProvider cleanup');
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            disconnectSocket();
        };
    }, []);

    return <>{children}</>;
};
