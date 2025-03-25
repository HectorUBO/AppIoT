import { useEffect, useRef } from "react";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Parcela {
    id: number;
    nombre: string;
    sensor: {
        humedad: number;
        temperatura: number;
        lluvia: number;
        sol: number;
    };
}

interface AreaChartSensoresProps {
    parcelas: Parcela[];
    metrica: "humedad" | "temperatura" | "lluvia" | "sol"; 
}

export const AreaChartSensores = ({ parcelas, metrica }: AreaChartSensoresProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current && parcelas.length > 0) {
            const labels = parcelas.map((p) => p.nombre);
            const data = parcelas.map((p) => p.sensor[metrica]);

            const backgroundColors = {
                humedad: "rgba(54, 162, 235, 0.2)",
                temperatura: "rgba(255, 99, 132, 0.2)",
                lluvia: "rgba(75, 192, 192, 0.2)",
                sol: "rgba(255, 206, 86, 0.2)",
            };

            const borderColors = {
                humedad: "rgb(54, 162, 235)",
                temperatura: "rgb(255, 99, 132)",
                lluvia: "rgb(75, 192, 192)",
                sol: "rgb(255, 206, 86)",
            };

            const config = {
                type: "line",
                data: {
                    labels,
                    datasets: [
                        {
                            label: metrica.charAt(0).toUpperCase() + metrica.slice(1),
                            data,
                            fill: true, 
                            backgroundColor: backgroundColors[metrica],
                            borderColor: borderColors[metrica],
                            borderWidth: 2,
                            tension: 0.4, 
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Distribución de ${metrica} por parcela`,
                            font: { size: 16 },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: metrica !== "temperatura", // Temperatura puede ser negativa
                            title: {
                                display: true,
                                text: metrica === "temperatura" ? "°C" : "%",
                            },
                        },
                    },
                },
            };

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                chartInstance.current = new Chart(ctx, config as any);
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [parcelas, metrica]);

    return <canvas ref={chartRef} />;
};