import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem("token");
                const storedRole = localStorage.getItem("role");
                const storedUser = localStorage.getItem("user");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setRole(storedRole);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error restoring auth state:", error);
                localStorage.clear();
            } finally {
                setLoading(false); 
            }
        };

        initializeAuth();
    }, []);

    const login = (userData, tokenData) => {
        localStorage.setItem("token", tokenData);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(tokenData);
        setRole(userData.role);
        setUser(userData);
        setLoading(false);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setRole(null);
        setUser(null);
        setLoading(false);
    };

    const value = {
        token,
        role,
        user,
        loading, 
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isEmployee: role === 'employee',
        isHR: role === 'HR' || role === 'admin',
        isAdmin: role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;