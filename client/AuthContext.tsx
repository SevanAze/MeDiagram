import axios from "axios";
import React, { ReactNode, createContext, useContext, useState, useMemo } from "react";

// Assurez-vous que cette interface correspond exactement à ce que vous attendez
// d'exposer comme valeur de contexte.
interface AuthContextType {
  verifyToken: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/token`, { token });
      setIsAuthenticated(response.data.isValid);
    } catch (error) {
      console.error('Token validation error:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const providerValue = useMemo(() => ({
    verifyToken,
    logout,
    isAuthenticated
  }), [isAuthenticated]);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};
