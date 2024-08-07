document.getElementById('analyzeButton').addEventListener('click', () => {
    const link = document.getElementById('linkInput').value;
    const status = document.getElementById('status');

    if (!link) {
        status.textContent = 'Por favor, cole um link.';
        return;
    }

    status.textContent = 'Conectando...';

    const ws = new WebSocket('ws://localhost:5500');

    ws.onopen = () => {
        console.log('Conectado ao servidor WebSocket');
        status.textContent = 'Conectado ao WebSocket';
        // Envia uma mensagem para o servidor WebSocket
        ws.send(JSON.stringify({ action: 'subscribe', link: link }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Formate os dados recebidos
        const formattedData = [{
            x: new Date(data.time),
            o: data.open,
            h: data.high,
            l: data.low,
            c: data.close
        }];
        updateChart(formattedData);
        status.textContent = 'Dados atualizados.';
    };

    ws.onerror = (error) => {
        console.error('WebSocket erro:', error);
        status.textContent = 'Erro ao conectar ao servidor WebSocket.';
    };

    ws.onclose = () => {
        console.log('Desconectado do servidor WebSocket');
        status.textContent = 'Desconectado do WebSocket';
    };
});

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
