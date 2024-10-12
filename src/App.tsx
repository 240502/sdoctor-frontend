import { privateRoutes, publicRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './routes/private_router';
import { Fragment, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from './stores/userAtom';

function App() {
    const setUser = useSetRecoilState(userState);
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
    useEffect(() => {
        getUser();
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
