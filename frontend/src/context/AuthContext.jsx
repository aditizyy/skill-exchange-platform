import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
   const response = await loginUser({ email, password });

   const { user, token } = response;

   localStorage.setItem('token', token);
   localStorage.setItem('user', JSON.stringify(user));
   setUser(user);

   return user;
 };
 const register = async (userData) => {
  const response = await registerUser(userData);

  const { user, token } = response;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);

  return user;
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);