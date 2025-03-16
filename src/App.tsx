import { privateRoutes, publicRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './routes/private_router';
import { Fragment, Suspense, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from './stores/userAtom';
import './assets/fontawesome/css/all.min.css';
import { patientProfileState } from './stores/patientAtom';
import { PatientProfileService } from './services/patient_profileService';
import socket from './socket';
import { User } from './models/user';
import { Skeleton } from 'antd';

function App() {

    const setUser = useSetRecoilState(userState);
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const handleWindowLoad = (user: User) => {
        if (user?.userId) {
            socket?.emit('joinRoom', { userId: user.userId });
        }
    };
    const getUser = async () => {
        try {
            const user = await JSON.parse(
                sessionStorage.getItem('user') || '{}'
            );
            if (user?.userId) {
                setUser(user);
                handleWindowLoad(user);
            }
        } catch (e: any) {
            console.error(e.message);
        }
    };
    const getPatientProfile = async () => {
        try {
            const uuid: string = await JSON.parse(
                localStorage.getItem('uuid') || 'null'
            );
            if (uuid) {
                const patientProfile =
                    await PatientProfileService.getPatientProfileByUuid(uuid);
                setPatientProfile(patientProfile);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getUser();
        getPatientProfile();
    }, []);
    return (
        <div className="App">
            <Router>
                <Suspense>
                    <Routes>
                        {publicRoutes.map((route, index): any => {
                            let Layout: any = route.layout
                                ? route.layout
                                : Fragment;
                            const Page = route.component;

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Suspense>
                                                <Page />
                                            </Suspense>
                                        </Layout>
                                    }
                                ></Route>
                            );
                        })}
                        <Route element={<PrivateRoutes />}>
                            {privateRoutes.map((route, index): any => {
                                const Page = route.component;
                                let Layout: any = route.layout;
                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Suspense
                                                    fallback={
                                                        <div className="text-center">
                                                            Loading ...
                                                        </div>
                                                    }
                                                >
                                                    <Page />
                                                </Suspense>
                                            </Layout>
                                        }
                                    ></Route>
                                );
                            })}
                        </Route>
                        ;
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
}

export default App;
