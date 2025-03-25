import { apiService } from './apiService';

interface ExternalPlot {
    id: number;
    nombre: string;
    ubicacion: string;
    responsable: string;
    tipo_cultivo: string;
    ultimo_riego: string;
    sensor: {
        humedad: number;
        temperatura: number;
        lluvia: number;
        sol: number;
    };
    latitud: number;
    longitud: number;
}

export const syncService = {
    async syncData(): Promise<{
        success: boolean;
        stats?: { updatedPlots: number; updatedSensors: number; errors: number };
    }> {
        try {
            const externalData = await apiService.fetchExternalData();
            let updatedPlots = 0;
            let updatedSensors = 0;
            let errors = 0;

            // Primero procesamos todas las parcelas
            for (const plot of externalData.parcelas) {
                try {
                    const plotData = this.transformPlot(plot);

                    // Enviamos el externalId para evitar duplicados
                    const response = await apiService.sendPlot({
                        ...plotData,
                        externalId: String(plot.id) // Asegurar que es string
                    });

                    // Luego procesamos los sensores de esta parcela
                    const sensorResult = await this.processSensors(plot, response.id);

                    updatedPlots++;
                    updatedSensors += sensorResult.sensorsSent;
                    errors += sensorResult.errors;
                } catch (err) {
                    errors++;
                    console.error(`Error procesando parcela ${plot.id}:`, err);
                }
            }

            return {
                success: errors === 0,
                stats: { updatedPlots, updatedSensors, errors }
            };
        } catch (error) {
            console.error('Sync failed completely:', error);
            return { success: false };
        }
    },

    async processSensors(externalPlot: ExternalPlot, plotId: number) {
        let sensorsSent = 0;
        let errors = 0;

        try {
            const sensorData = this.transformSensorData(externalPlot, plotId);
            await apiService.sendPlotData(sensorData);
            sensorsSent++;
        } catch (err) {
            errors++;
            console.error(`Error sync sensors for plot ${externalPlot.id}:`, err);
        }

        return { sensorsSent, errors };
    },

    transformPlot(externalPlot: ExternalPlot) {
        return {
            name: externalPlot.nombre,
            location: externalPlot.ubicacion,
            owner: externalPlot.responsable,
            plotType: externalPlot.tipo_cultivo,
            lastWatered: new Date(externalPlot.ultimo_riego).toISOString(),
            latitude: externalPlot.latitud,
            longitude: externalPlot.longitud,
            isActive: true
        };
    },

    transformSensorData(externalPlot: ExternalPlot, plotId: number) {
        return {
            temperature: externalPlot.sensor.temperatura,
            humidity: externalPlot.sensor.humedad,
            rain: externalPlot.sensor.lluvia,
            sunIntensity: externalPlot.sensor.sol,
            recordedAt: new Date(externalPlot.ultimo_riego).toISOString(),
            plotId
        };
    }
};