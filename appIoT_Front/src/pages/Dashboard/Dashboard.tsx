import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import MapComponent from '../../components/Mapa/Map';
import Card from '../../components/Card/Card';
import './Dashboard.css'

function Dashboard() {
  const [sensorData, setSensorData] = useState(null);

  const handleLogout = () => {
    alert('Sesión cerrada');
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get('https://moriahmkt.com/iotapp/test/');
        setSensorData(response.data.sensores);
      } catch (error) {
        console.error('Error al obtener los datos de sensores:', error);
      }
    };

    fetchSensorData();
  }, [])

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header onLogout={handleLogout} />
        <div className="map-container">
          <MapComponent accessToken='pk.eyJ1IjoiaGVjdG9yYmFvIiwiYSI6ImNtMjk1eDhpMDAyMDgyanE0OWNyYXA5azkifQ.U9VvqKyWH0QCPx-lR-81Dw' />
        </div>
        <div className="cards-container">
          <Card title='Temperatura' value={sensorData ? `${sensorData.temperatura}°C` : 'Cargando...'} />
          <Card title='Humedad' value={sensorData ? `${sensorData.humedad}%` : 'Cargando...'} />
          <Card title='Lluvia' value={sensorData ? `${sensorData.lluvia} mm` : 'Cargando...'} />
          <Card title='Intensidad del Sol' value={sensorData ? `${sensorData.sol}%` : 'Cargando...'} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
