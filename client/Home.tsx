import React, { useState } from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { useAuth } from './AuthContext';
import SignInModal from './SignInModal';
// Importez d'autres composants de page ici

function Home() {

  const { isAuthenticated } = useAuth();

  return (
    <ResponsiveAppBar isAuthenticated={isAuthenticated}/>
  );
}

export default Home;