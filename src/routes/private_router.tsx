import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
