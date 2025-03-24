import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapProps {
  accessToken: string;
}

const MapComponent: React.FC<MapProps> = ({ accessToken }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-86.83359890237877, 21.141697702942267],
      zoom: 14,
    });

    return () => map.remove();
  }, [accessToken]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100vh", height: "100vh" }}
    />
  );
};

export default MapComponent;
