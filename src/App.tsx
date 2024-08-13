import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Register from './screens/Register';
import OAuthCallback from './screens/OAuthCallback';
import Adm from './screens/Adm';
import PrivateRoute from './routes/PrivateRoute'; // Importe o componente de rota privada
import Login from './screens/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route
          path="/adm"
          element={
            <PrivateRoute>
              <Adm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
