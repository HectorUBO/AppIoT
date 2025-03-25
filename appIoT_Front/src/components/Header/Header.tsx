import React from 'react';
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <div className="header-container">
      <button className="refresh-button" onClick={() => window.location.reload()}>
        Actualizar Datos
      </button>
      <button className="logout-button" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
