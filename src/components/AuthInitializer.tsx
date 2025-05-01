import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from '../stores/userAtom';
import { patientProfileService } from '../services';
import { patientProfileState } from '../stores/patientAtom';

const AuthInitializer = () => {
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const setUser = useSetRecoilState(userState);
    const getLocalUser = async () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUser(user);
            } catch {
                localStorage.removeItem('user'); // nếu lỗi parse
            }
        }
    };
    const getPatientProfile = async () => {
        try {
            const uuid: string = await JSON.parse(
                localStorage.getItem('uuid') || 'null'
            );
            console.log('uuid', uuid);

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
