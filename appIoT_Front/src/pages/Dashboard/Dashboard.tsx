import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import MapComponent from "../../components/Map/Map";
import "./Dashboard.css";
import { LineChartSensores } from "../../components/Charts/LineChart/LineChartSensores";
import { BarChartSensores } from "../../components/Charts/BarChart/BarChartSensores";
import { Card } from "../../components/Card/Card";
import { AreaChartSensores } from "../../components/Charts/AreaChart/AreaCharSensores";

function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [parcelasData, setParcelasData] = useState([]);

  const handleLogout = () => {
    alert("Sesión cerrada");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://moriahmkt.com/iotapp/test/");
        setSensorData(response.data.sensores);
        setParcelasData(response.data.parcelas);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header onLogout={handleLogout} />

        <div className="top-section">
          <div className="map-container">
            <MapComponent accessToken="pk.eyJ1IjoiaGVjdG9yYmFvIiwiYSI6ImNtMjk1eDhpMDAyMDgyanE0OWNyYXA5azkifQ.U9VvqKyWH0QCPx-lR-81Dw" />
          </div>
          <div className="cards-container">
            <Card title="Temperatura" value={sensorData ? `${sensorData.temperatura}°C` : "Cargando..."} />
            <Card title="Humedad" value={sensorData ? `${sensorData.humedad}%` : "Cargando..."} />
            <Card title="Lluvia" value={sensorData ? `${sensorData.lluvia} mm` : "Cargando..."} />
            <Card title="Intensidad del Sol" value={sensorData ? `${sensorData.sol}%` : "Cargando..."} />
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <LineChartSensores parcelas={parcelasData} />
          </div>

          <div className="chart-card">
            <BarChartSensores parcelas={parcelasData} metricas={["humedad", "temperatura"]} />
          </div>

          <div className="chart-card">
            <AreaChartSensores parcelas={parcelasData} metrica="humedad" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;