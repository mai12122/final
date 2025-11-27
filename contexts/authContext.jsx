import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../service/authService';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const checkUser = async () => {
setLoading(true);
const currentUser = await authService.getCurrentUser();
setUser(currentUser);
setLoading(false);
};
const login = async (email, password) => {
await authService.login(email, password);
await checkUser();
};
const register = async (email, password, name) => {
await authService.register(email, password, name);
await checkUser();
};
const logout = async () => {
await authService.logout();
setUser(null);
};
useEffect(() => {
checkUser();
}, []);
return (
<AuthContext.Provider value={{ user, loading, login, register, logout }}>
{children}
</AuthContext.Provider>
);
};
export const useAuth = () => useContext(AuthContext);