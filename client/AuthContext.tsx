import axios from "axios";
import React, { ReactNode, createContext, useContext, useState, useMemo } from "react";
import { JwtPayload, jwtDecode } from 'jwt-decode';


// Assurez-vous que cette interface correspond exactement à ce que vous attendez
// d'exposer comme valeur de contexte.
interface AuthContextType {
  verifyToken: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  userId?: number,
}

interface CustomTokenPayload extends JwtPayload {
  id: string; // Ajoutez ici d'autres champs personnalisés si nécessaire
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
      const decodedToken = jwtDecode(token) as CustomTokenPayload;
      setUserId(parseInt(decodedToken.id))
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
    isAuthenticated,
    userId,
  }), [isAuthenticated]);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};
