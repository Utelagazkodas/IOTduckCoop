let websockets: WebSocket[] = [];

export function handleWebsocket(socket: WebSocket) {
  socket.addEventListener("open", () => {
    websockets.push(socket);
    const reassign: WebSocket[] = [];
    websockets.forEach((cursocket) => {
      if (cursocket.readyState == cursocket.OPEN) {
        reassign.push(cursocket)
        cursocket.send("asd")
      }
    });
    websockets = reassign;
  });
}
