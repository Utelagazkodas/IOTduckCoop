let websockets: WebSocket[] = [];

export function handleWebsocket(socket: WebSocket) {
  socket.addEventListener("open", () => {
    websockets.push(socket);
  });
}
