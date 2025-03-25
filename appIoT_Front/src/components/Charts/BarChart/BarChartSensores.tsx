import { useEffect, useRef } from "react";
import {
    Chart,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
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

interface BarChartSensoresProps {
    parcelas: Parcela[];
    metricas?: ("humedad" | "temperatura" | "lluvia" | "sol")[];
}

export const BarChartSensores = ({
    parcelas,
    metricas = ["humedad", "temperatura"],
}: BarChartSensoresProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current && parcelas.length > 0) {
            const labels = parcelas.map((p) => p.nombre);
            const datasets = metricas.map((metrica) => ({
                label: metrica.charAt(0).toUpperCase() + metrica.slice(1),
                data: parcelas.map((p) => p.sensor[metrica]),
                backgroundColor:
                    metrica === "humedad"
                        ? "rgba(54, 162, 235, 0.7)"
                        : metrica === "temperatura"
                            ? "rgba(255, 99, 132, 0.7)"
                            : metrica === "lluvia"
                                ? "rgba(75, 192, 192, 0.7)"
                                : "rgba(255, 206, 86, 0.7)",
                borderColor:
                    metrica === "humedad"
                        ? "rgb(54, 162, 235)"
                        : metrica === "temperatura"
                            ? "rgb(255, 99, 132)"
                            : metrica === "lluvia"
                                ? "rgb(75, 192, 192)"
                                : "rgb(255, 206, 86)",
                borderWidth: 1,
            }));

            const data = {
                labels,
                datasets,
            };

            const config = {
                type: "bar",
                data,
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Comparativa de Sensores por Parcela",
                            font: { size: 16 },
                        },
                        legend: {
                            position: "top",
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Valor",
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
    }, [parcelas, metricas]);

    return <canvas ref={chartRef} />;
};