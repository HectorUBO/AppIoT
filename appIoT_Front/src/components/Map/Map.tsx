import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  accessToken: string;
}

interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  ultimo_riego: string;
  latitud: number;
  longitud: number;
}

const MapComponent: React.FC<MapProps> = ({ accessToken }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const response = await axios.get("https://moriahmkt.com/iotapp/test/");
        console.log("Datos recibidos:", response.data.parcelas);
        setParcelas(response.data.parcelas);
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    fetchParcelas();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-86.87068413377602, 21.057728649249526],
      zoom: 12,
    });

    mapRef.current.on('load', () => {
      addMarkersToMap();
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [accessToken]);

  useEffect(() => {
    if (mapRef.current && parcelas.length > 0) {
      addMarkersToMap();
    }
  }, [parcelas]);

  const addMarkersToMap = () => {
    if (!mapRef.current || parcelas.length === 0) return;

    console.log("Añadiendo marcadores al mapa...");

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    parcelas.forEach((parcela) => {
      console.log(`Marcador: ${parcela.nombre} - Lat: ${parcela.latitud}, Lng: ${parcela.longitud}`);

      if (isNaN(parcela.latitud) || isNaN(parcela.longitud)) {
        console.warn(`Coordenadas inválidas para parcela ${parcela.id}`);
        return;
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: Arial, sans-serif; padding: 10px; max-width: 200px; color: black;">
          <h4 style="margin: 0; font-size: 16px; color: black;">${parcela.nombre}</h4>
          <p style="margin: 5px 0; font-size: 14px; color: black;">
            <strong>Ubicación:</strong> ${parcela.ubicacion}<br>
            <strong>Responsable:</strong> ${parcela.responsable}<br>
            <strong>Tipo de cultivo:</strong> ${parcela.tipo_cultivo}<br>
            <strong>Último riego:</strong> ${formatDateTime(parcela.ultimo_riego)}
          </p>
        </div>
      `);      

      const marker = new mapboxgl.Marker()
        .setLngLat([parcela.longitud, parcela.latitud])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  };

  const formatDateTime = (dateString: string): string => {
    return !isNaN(Date.parse(dateString))
      ? new Date(dateString).toLocaleString()
      : dateString;
  };

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default MapComponent;