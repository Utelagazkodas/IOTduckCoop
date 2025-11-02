import { websocketUserAuth, WSRelay } from "../../shared/classes.ts";
import { Authorization } from "../utility/runtimeUtil.ts";
import { updateCamData } from "./camWS.ts";
import { channels } from "./websocket.ts";
import { isWSRelay } from "../utility/runtimeUtil.ts";

/* --------------------------------------------------
   USER AUTH HANDLER
-------------------------------------------------- */
export async function handleUserAuth(socket: WebSocket, auth: websocketUserAuth) {
  const sessionTokenData = await Authorization.authToken(auth.sessionToken);

  if (typeof sessionTokenData == "string") {
    socket.close(1011, sessionTokenData);
    return;
  }

  if (sessionTokenData.admin) {
    socket.close(1011, "admin cant connect");
  }

  if (!channels[sessionTokenData.camPublicId!]) {
    socket.close(
      1011,
      "no channel for that camera, this is unlinkely to happen",
    );
  }

  channels[sessionTokenData.camPublicId!].connectedUserSockets.push(socket);

  updateCamData(sessionTokenData.camPublicId!)

  socket.addEventListener("close", (ev) => {
    handleUserDisconnect(socket, sessionTokenData.camPublicId!);
  });
}

/* --------------------------------------------------
   USER DISCONNECT HANDLER
-------------------------------------------------- */
export function handleUserDisconnect(socket: WebSocket, camPublicId: string) {
  if (channels[camPublicId]) {
    const index = channels[camPublicId].connectedUserSockets.indexOf(socket, 0);
    if (index > -1) {
      channels[camPublicId].connectedUserSockets.splice(index, 1);
    }

    updateCamData(camPublicId)
  }
}


/* --------------------------------------------------
   USER MESSAGE HANDLER
-------------------------------------------------- */
export async function handleUserMessage(socket: WebSocket, ev: MessageEvent<any>, auth: websocketUserAuth) {
  // MESSAGE FROM USER

  const sessionTokenData = await Authorization.authToken(auth.sessionToken);

  if (typeof sessionTokenData == "string") {
    socket.close(1011, sessionTokenData);
    return;
  }

  if (!channels[sessionTokenData.camPublicId!]) {
    socket.close(
      1011,
      "camera disconnected since last message",
    );
  }

  let data : WSRelay

  try {
    data = JSON.parse(ev.data);
    if (!data) {
      throw "";
    }
  } catch (error) {
    socket.close(1002, "bad json or no json");
    return;
  }

  if(isWSRelay(data)){
    channels[sessionTokenData.camPublicId!].cameraSocket.send(JSON.stringify(data.relay))
  }
  else{
    socket.close(1001, "bad format of json")
  }
}