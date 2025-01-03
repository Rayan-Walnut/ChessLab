import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import direct des composants
import Home from './pages/Home';
import Details from './pages/Details';
import VehicleExplorer from './pages/VehicleExplorer';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import PrivateRoute from './components/PrivateRoute';
import EcoleEquipe from './pages/TeamPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
        <Route path="/explorer" element={<VehicleExplorer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ecole/equipe" element={<EcoleEquipe />} />



        {/* Routes privées */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      
      </Routes>
    </BrowserRouter>
  );
};

export default App;