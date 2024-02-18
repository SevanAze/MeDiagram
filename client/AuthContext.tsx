import axios from "axios";
import React, { ReactNode, createContext, useContext, useState, useMemo } from "react";
import jwtDecode from 'jwt-decode';


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
  const [userId, setUserId] = useState<number>();

  const verifyToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/token`, { token });
      setIsAuthenticated(response.data.isValid);
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id)
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
