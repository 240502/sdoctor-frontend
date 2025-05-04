import { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    authLoadingState,
    isAuthenticatedState,
    userState,
} from '../stores/userAtom';
import { patientProfileService } from '../services';
import { patientProfileState } from '../stores/patientAtom';
import { userService } from '../services';
import { User } from '../models';
import { getSocket, joinRoom } from '../socket';
const AuthInitializer = () => {
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
    const setUser = useSetRecoilState(userState);
    const setAuthLoading = useSetRecoilState(authLoadingState);
    // Sử dụng ref để theo dõi userId đã join room
    const joinedUserIdRef = useRef<string | number | null>(null);
    const user = useRecoilValue(userState);
    const getLocalUser = async () => {
        try {
            setAuthLoading(true);
            const user = await userService.getCurrentUser();
            setIsAuthenticated(true);
            setUser(user);
        } catch (err) {
            try {
                const refreshTokenResponse = await userService.refreshToken();
                setIsAuthenticated(true);
                setUser(refreshTokenResponse.result);
                localStorage.setItem(
                    'user',
                    JSON.stringify(refreshTokenResponse.result)
                );
            } catch (refreshErr) {
                setIsAuthenticated(false);
                setUser({} as User);
            }
        } finally {
            setAuthLoading(false);
        }
    };
    const getPatientProfile = async () => {
        try {
            const uuid: string = await JSON.parse(
                localStorage.getItem('uuid') || 'null'
            );
            if (uuid) {
                const patientProfile =
                    await patientProfileService.getPatientProfileByUuid(uuid);

                setPatientProfile(patientProfile);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getLocalUser();
        getPatientProfile();
    }, []);
    useEffect(() => {
        // Gọi joinRoom khi user thay đổi và chưa được join
        if (user?.userId && user.userId !== joinedUserIdRef.current) {
            joinRoom(user.userId);
            joinedUserIdRef.current = user.userId;
            console.log(`User ${user.userId} joined room`);
        }
        // Xử lý sự kiện connect/reconnect
        const socket = getSocket();
        const handleConnect = () => {
            if (user?.userId && user.userId !== joinedUserIdRef.current) {
                joinRoom(user.userId);
                joinedUserIdRef.current = user.userId;
                console.log(
                    `User ${user.userId} rejoined room after reconnect`
                );
            }
        };
        const handleDisconnect = () => {
            joinedUserIdRef.current = null; // Reset để cho phép join lại sau reconnect
            console.log('Socket disconnected, reset joinedUserIdRef');
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        // Cleanup
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, [user]);

    return null;
};

export default AuthInitializer;
