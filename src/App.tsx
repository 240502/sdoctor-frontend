import { privateRoutes, publicRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './routes/private_router';
import { Fragment, Suspense } from 'react';
import './assets/fontawesome/css/all.min.css';
import AuthInitializer from './components/AuthInitializer';

function App() {
    return (
        <div className="App">
            <AuthInitializer />
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
