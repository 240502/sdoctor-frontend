import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
