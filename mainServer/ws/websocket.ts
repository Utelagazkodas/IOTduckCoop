import {

  type websocketCamAuth,
  type websocketUserAuth,
} from "../../shared/classes.ts";
import {
  isWebsocketCamAuth,
  isWebsocketUserAuth,
} from "../utility/runtimeUtil.ts";
import { handleCameraAuth, handleCameraMessage } from "./camWS.ts";
import { handleUserAuth, handleUserMessage } from "./userWS.ts";

export const channels: {
  [publicId: string]: {
    cameraSocket: WebSocket;
    connectedUserSockets: WebSocket[];
  };
} = {};

export function handleWebsocket(socket: WebSocket) {
  let auth: websocketCamAuth | websocketUserAuth | undefined = undefined;

  socket.addEventListener("message", async (ev: MessageEvent<any>) => {
    if (auth == undefined) {
      try {
        auth = JSON.parse(ev.data);

        if(!auth){
          throw ""
        }
      } catch (error) {
        socket.close(1001, "bad or no json")
        return
      }

      await handleInitialAuth(socket, auth!);
    } else if (isWebsocketCamAuth(auth)) {
      handleCameraMessage(socket, ev, auth);
    } else if (isWebsocketUserAuth(auth)) {
      handleUserMessage(socket, ev, auth);
    } else {
      socket.close();
    }
  });
}

/* --------------------------------------------------
   INITIAL AUTH HANDLER
-------------------------------------------------- */
async function handleInitialAuth(
  socket: WebSocket,
  auth: websocketCamAuth | websocketUserAuth,
) {
  if (isWebsocketCamAuth(auth)) {
    await handleCameraAuth(socket, auth);
  } else if (isWebsocketUserAuth(auth)) {
    await handleUserAuth(socket, auth);
  } else {
    socket.close(
      1002,
      "bad first message, it needs to json either websocketCamAuth or websocketUserAuth",
    );
  }
}


// note: chatgpt helped me refactor the code, no logic was written by it tho


