import  { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';

type MainLayoutProps = {
  children: ReactNode; // Define o tipo da prop 'children'
}

function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* Conteúdo Principal */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'pl-56' : 'pl-16'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
