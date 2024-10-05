import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Register from './screens/Register';
//import OAuthCallback from './screens/OAuthCallback';
import Adm from './screens/Adm';
import PrivateRoute from './routes/PrivateRoute'; // Importe o componente de rota privada
import Login from './screens/Login';
import CreatEvent from './screens/CreateEvent';
import Sidebar from './components/Sidebar';
import EventList from './screens/EventList';
import HorizontalCalendar from './components/HorizontalCalendar';
import EditEvent from './screens/EditEvent';




const App: React.FC = () => {


  return (
    <Router>

    <div className='flex'>
      <Sidebar/>

      <div className='flex-1'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>}/>
        <Route path="/create-event" element={<PrivateRoute><CreatEvent /></PrivateRoute>}/>
        <Route path="/adm" element={<PrivateRoute><Adm /></PrivateRoute>}/>
        <Route path="/EventList" element={<EventList />}/>
        <Route path="/edit-event/:googleCalendarId" element={<PrivateRoute><EditEvent /></PrivateRoute>} /> 
        <Route path="/edit-event-id/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />
        

        <Route path="DataTest" element={<HorizontalCalendar />}/>
      </Routes>

      </div>

    </div>

      
    </Router>
  );
};

export default App;
