import asyncio
import json
import websockets

async def handle_websocket(websocket, path):
    print("Cliente conectado")

    try:
        async for message in websocket:
            # Simula o envio de dados para o cliente
            data = {
                'time': 1662144000000,  # Exemplo de timestamp
                'open': 10,
                'high': 15,
                'low': 5,
                'close': 20
            }
            await websocket.send(json.dumps(data))
    except websockets.ConnectionClosed:
        print("Conexão fechada")
    except Exception as e:
        print(f"Erro: {e}")

async def main():
    server = await websockets.serve(handle_websocket, "185.199.111.153t", 2606)
    print("Servidor WebSocket iniciado em ws://localhost:5500")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
