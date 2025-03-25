import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface Parcela {
    id: number;
    nombre: string;
    sensor: {
        humedad: number;
        temperatura: number;
    };
}

interface LineChartSensoresProps {
    parcelas: Parcela[];
}

export const LineChartSensores = ({ parcelas }: LineChartSensoresProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current && parcelas.length > 0) {
            const labels = parcelas.map(p => p.nombre);
            const humedadData = parcelas.map(p => p.sensor.humedad);
            const temperaturaData = parcelas.map(p => p.sensor.temperatura);

            const data = {
                labels: labels,
                datasets: [
                    {
                        label: "Humedad (%)",
                        data: humedadData,
                        borderColor: "rgb(54, 162, 235)",
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        tension: 0.3,
                        yAxisID: "y",
                    },
                    {
                        label: "Temperatura (°C)",
                        data: temperaturaData,
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        tension: 0.3,
                        yAxisID: "y1",
                    },
                ],
            };
            const config = {
                type: "line",
                data: data,
                options: {
                    responsive: true,
                    interaction: {
                        mode: "index",
                        intersect: false,
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: "Humedad y Temperatura por Parcela",
                            font: {
                                size: 16,
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    let label = context.dataset.label || "";
                                    if (label) {
                                        label += ": ";
                                    }
                                    label += context.parsed.y.toFixed(1);
                                    return label;
                                },
                            },
                        },
                    },
                    scales: {
                        y: {
                            type: "linear",
                            display: true,
                            position: "left",
                            title: {
                                display: true,
                                text: "Humedad (%)",
                            },
                        },
                        y1: {
                            type: "linear",
                            display: true,
                            position: "right",
                            title: {
                                display: true,
                                text: "Temperatura (°C)",
                            },
                            grid: {
                                drawOnChartArea: false,
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
    }, [parcelas]);

    return <canvas ref={chartRef} />;
};