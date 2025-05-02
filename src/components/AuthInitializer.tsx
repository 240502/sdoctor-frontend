import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
    authLoadingState,
    isAuthenticatedState,
    userState,
} from '../stores/userAtom';
import { patientProfileService } from '../services';
import { patientProfileState } from '../stores/patientAtom';
import { userService } from '../services';
import { User } from '../models';
import { joinRoom } from '../socket';
const AuthInitializer = () => {
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
    const setUser = useSetRecoilState(userState);
    const setAuthLoading = useSetRecoilState(authLoadingState);

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
                joinRoom(refreshTokenResponse.result.userId);

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

    return null;
};

export default AuthInitializer;
