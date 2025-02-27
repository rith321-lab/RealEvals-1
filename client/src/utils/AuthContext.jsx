import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  const updateAuthState = () => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
    setUserRole(localStorage.getItem('role'));
  };

  useEffect(() => {
    window.addEventListener('authChange', updateAuthState);
    return () => {
      window.removeEventListener('authChange', updateAuthState);
    };
  }, []);

  return <AuthContext.Provider value={{ isLoggedIn, userRole, updateAuthState }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
