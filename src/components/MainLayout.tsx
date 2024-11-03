import  { ReactNode, } from 'react';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from './app-Sidebar';
import { UserSheet } from './UserSheet';
import Header from './Header';

type MainLayoutProps = {
  children: ReactNode; // Define o tipo da prop 'children'
}

function MainLayout({ children }: MainLayoutProps) {
  

 

  return (
    
    <SidebarProvider>
    {/* Sidebar */}
    
    <AppSidebar  />
    
    {/* Main Content with Header */}
    <div className="flex-1 flex flex-col">
        {/* Header Fixo */}
        <Header/>
        
      {/* Page Content */}
      <main className="flex-1 p-4 transition-all duration-300 overflow-auto">
       
        {children}
      </main>
    </div>
  </SidebarProvider>
  )
}

export default MainLayout;
