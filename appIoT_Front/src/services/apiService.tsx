const BACKEND_URL = "http://localhost:3000";

export const apiService = {
    async fetchExternalData() {
        try {
            const response = await fetch("https://moriahmkt.com/iotapp/test/");
            if (!response.ok) throw new Error('Error en la API');
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo los datos:', error);
            throw error;
        }
    },

    async sendPlot(plotData: any) {
        try {
            const response = await fetch(`${BACKEND_URL}/plots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plotData),
            });
            if (!response.ok) throw new Error('Error al guardar parcela');
            return await response.json();
        } catch (error) {
            console.error('Error enviando datos:', error);
            throw error;
        }
    },

    async sendPlotData(plotData: any) {
        try {
            const response = await fetch(`${BACKEND_URL}/plot-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(plotData),
            });
            if (!response.ok) throw new Error('Erro al guardar los datos');
            return await response.json();
        } catch (error) {
            console.error('Error enviando los datos:', error);
            throw error;
        }
    }
}