import  { ReactNode, } from 'react';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from './app-Sidebar';

type MainLayoutProps = {
  children: ReactNode; // Define o tipo da prop 'children'
}

function MainLayout({ children }: MainLayoutProps) {
  

 

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1 transition-all  duration-300'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default MainLayout;
