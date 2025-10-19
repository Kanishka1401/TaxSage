import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Fix: Check the actual token structure from your backend
                if (decodedToken && decodedToken.id) {
                    setUser({ 
                        id: decodedToken.id,
                        // Add other user data from localStorage if available
                        ...JSON.parse(localStorage.getItem('user') || '{}')
                    });
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error("Invalid token found:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (token, userData = null) => {
        localStorage.setItem('token', token);
        try {
            const decodedToken = jwtDecode(token);
            const userInfo = userData || { id: decodedToken.id };
            setUser(userInfo);
            
            // Also store user data in localStorage for persistence
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (error) {
            console.error("Invalid token during login:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('ca_token');
        localStorage.removeItem('ca_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;