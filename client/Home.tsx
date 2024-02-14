import React from 'react';
import { useAuth } from './AuthContext';
import ResponsiveAppBar from './components/ResponsiveAppBar';
// Importez d'autres composants de page ici

function Home() {

  const { isAuthenticated } = useAuth();

  return (
    <ResponsiveAppBar isAuthenticated={isAuthenticated}/>
  );
}

export default Home;