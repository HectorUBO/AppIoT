import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <h1>App IoT</h1>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Parcelas Eliminadas</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;