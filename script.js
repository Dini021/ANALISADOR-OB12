document.getElementById('analyzeButton').addEventListener('click', () => {
    const link = document.getElementById('linkInput').value;
    const status = document.getElementById('status');
    const recommendation = document.getElementById('recommendation');

    if (!link) {
        status.textContent = 'Por favor, cole um link.';
        return;
    }

    status.textContent = 'Buscando dados...';

    async function fetchData() {
        try {
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados: ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            status.textContent = 'Erro ao buscar dados.';
            return null;
        }
    }

    function analyzeData(data) {
        if (data.length < 2) return 'Nenhuma análise disponível';

        const lastData = data[data.length - 1];
        const prevData = data[data.length - 2];

        return lastData.c > prevData.c ? 'Compra' : 'Venda';
    }

    function updateChart(data) {
        const ctx = document.getElementById('marketChart').getContext('2d');

        new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: 'Candlestick',
                    data: data,
                    borderColor: 'rgba(0, 0, 0, 0.7)',
                    color: {
                        up: 'rgba(76, 175, 80, 1)', // Verde para alta
                        down: 'rgba(244, 67, 54, 1)' // Vermelho para baixa
                    },
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        title: {
                            display: true,
                            text: 'Tempo'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Preço'
                        }
                    }
                }
            }
        });
    }

    async function refreshData() {
        const data = await fetchData();
        if (data) {
            const formattedData = data.map(item => ({
                x: new Date(item.time),
                o: item.open,
                h: item.high,
                l: item.low,
                c: item.close
            }));
            updateChart(formattedData);
            recommendation.textContent = `Recomendação: ${analyzeData(formattedData)}`;
            status.textContent = 'Dados atualizados.';
        }
    }

    // Atualiza os dados a cada 10 segundos
    const updateInterval = setInterval(refreshData, 10000);

    // Para a atualização ao sair da página
    window.addEventListener('beforeunload', () => {
        clearInterval(updateInterval);
    });

    // Inicializa a primeira chamada
    refreshData();
});
