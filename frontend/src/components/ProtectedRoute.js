import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, role, user, loading } = useAuth();

    if (loading) {
        return (
            <Box 
                display="flex" 
                flexDirection="column"
                justifyContent="center" 
                alignItems="center" 
                minHeight="60vh"
            >
                <CircularProgress />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    // Check if user is authenticated
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'employee') {
            return <Navigate to="/employee/dashboard" replace />;
        } else if (role === 'HR' || role === 'admin') {
            return <Navigate to="/hr/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;