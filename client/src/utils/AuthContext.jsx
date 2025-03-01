import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data in localStorage
    const storedToken = localStorage.getItem('access_token');
    const storedUserData = localStorage.getItem('user_data');

    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('role');
      }
    }
    
    setIsLoading(false);
    
    // Listen for storage events (for multi-tab synchronization)
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('access_token');
      const currentUserData = localStorage.getItem('user_data');
      
      if (!currentToken) {
        // User logged out in another tab
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } else if (currentToken !== token) {
        // User logged in or changed in another tab
        try {
          const userData = JSON.parse(currentUserData);
          setUser(userData);
          setToken(currentToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear user data from state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('role');
    localStorage.removeItem('refresh_token');
    
    // Trigger storage event for multi-tab synchronization
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }; 