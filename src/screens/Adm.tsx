import React from 'react';
import Sidebar from '../components/Sidebar';

const Adm: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <div className="flex">
     
      <div className="flex-1 p-4">
        <h1>Administração</h1>
        <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Adm;
