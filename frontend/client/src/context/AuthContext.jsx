import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        const storedUser = localStorage.getItem('user');
        
        console.log('AuthContext - Initializing:', { token, storedUserType, storedUser });
        
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('AuthContext - Decoded token:', decodedToken);
                
                if (decodedToken && decodedToken.id) {
                    const userData = storedUser ? JSON.parse(storedUser) : { id: decodedToken.id };
                    setUser(userData);
                    setUserType(storedUserType || 'user');
                    console.log('AuthContext - User set:', userData);
                    console.log('AuthContext - UserType set:', storedUserType || 'user');
                } else {
                    console.log('AuthContext - Invalid token, clearing storage');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userType');
                }
            } catch (error) {
                console.error("AuthContext - Invalid token found:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
            }
        } else {
            console.log('AuthContext - No token found');
        }
        setLoading(false);
    }, []);

    const login = (token, userData = null, type = 'user') => {
        console.log('AuthContext - Login called:', { token, userData, type });
        
        localStorage.setItem('token', token);
        localStorage.setItem('userType', type);
        
        try {
            const decodedToken = jwtDecode(token);
            console.log('AuthContext - Login decoded token:', decodedToken);
            
            const userInfo = userData || { id: decodedToken.id, name: decodedToken.name, email: decodedToken.email };
            setUser(userInfo);
            setUserType(type);
            
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                localStorage.setItem('user', JSON.stringify(userInfo));
            }
            
            console.log('AuthContext - Login successful:', { user: userInfo, userType: type });
        } catch (error) {
            console.error("AuthContext - Invalid token during login:", error);
        }
    };

    const logout = () => {
        console.log('AuthContext - Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        setUser(null);
        setUserType(null);
    };

    const value = {
        user,
        userType,
        login,
        logout,
        loading
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;