import { Outlet, Navigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authLoadingState, isAuthenticatedState } from '../stores/userAtom';

const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] =
        useRecoilState(isAuthenticatedState);
    const isLoading = useRecoilValue(authLoadingState);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
