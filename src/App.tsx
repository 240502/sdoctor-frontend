import { useState } from 'react';
import { Button } from 'antd';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { publicRoutes } from './routes';
import { AppLayout } from './modules/app';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <Router>
                <Routes>
                    {publicRoutes.map((route, index): any => {
                        let Layout: any = route.layout;
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
                </Routes>
            </Router>
        </div>
    );
}

export default App;
