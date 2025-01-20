import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    return true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
