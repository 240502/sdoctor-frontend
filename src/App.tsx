import { privateRoutes, publicRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './routes/private_router';
import { Fragment, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from './stores/userAtom';
import './assets/fontawesome/css/all.min.css';
import { patientProfileState } from './stores/patientAtom';
import { PatientProfileService } from './services/patient_profileService';
function App() {
    const setUser = useSetRecoilState(userState);
    const setPatientProfile = useSetRecoilState(patientProfileState);
    const getUser = async () => {
        try {
            const user = await JSON.parse(
                sessionStorage.getItem('user') || '{}'
            );
            setUser(user);
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
                <Routes>
                    {publicRoutes.map((route, index): any => {
                        let Layout: any =
                            route.layout === null ? Fragment : route.layout;
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
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
                                            <Page />
                                        </Layout>
                                    }
                                ></Route>
                            );
                        })}
                    </Route>
                    ;
                </Routes>
            </Router>
        </div>
    );
}

export default App;
