import React, { useEffect, useState, createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { atom, selector, useSetRecoilState } from 'recoil';
import { appointmentListState } from './appointmentAtom';
interface SocketContextProps {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });
export const useSocket = () => {
    return useContext(SocketContext);
};

// export const SocketProvider: React.FC = ({ children }: any) => {
//     const setAppointments = useSetRecoilState(appointmentListState);
//     const [sokect, setSocket] = useState<Socket | null>(null);
//     useEffect(() => {
//         //Kết nối đến Socket.IO server
//         const newSocket: Socket = io('http://localhost:4000', {
//             transports: ['websocket'],
//         });
//         setSocket(newSocket);
//     }, []);
// };
