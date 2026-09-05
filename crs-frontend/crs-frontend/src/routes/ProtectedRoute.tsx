import {
    Navigate,
    Outlet,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    requiredRole?: 'ADMIN' | 'STUDENT';
}

export default function ProtectedRoute({
                                           requiredRole,
                                       }: ProtectedRouteProps) {
    const {
        user,
        isAuthenticated,
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        requiredRole &&
        user?.role !== requiredRole
    ) {
        return (
            <Navigate
                to="/courses"
                replace
            />
        );
    }

    return <Outlet />;
}