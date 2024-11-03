// Header.tsx
import { FC, ReactNode } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserSheet } from './UserSheet';  // Importando o UserSheet

type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

const Header: FC<HeaderProps> = ({ children, className }) => {
  return (
    <header
      className={`p-4 fixed w-full z-20 bg-blue-600 h-10 flex items-center justify-between shadow-md ${className}`}
    >
      {/* Esquerda: SidebarTrigger e título */}
      <div className="flex items-center">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold pl-11 text-white">Agenda Ki</h1>
      </div>

      {/* Direita: UserSheet para abrir o perfil */}
      <UserSheet />

      {children}
    </header>
  );
};

export default Header;
