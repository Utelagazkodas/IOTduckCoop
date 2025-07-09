import {type websocketCamAuth, type websocketUserAuth } from "../utility/classes.ts";
import { isWebsocketCamAuth, isWebsocketUserAuth } from "../utility/runtimeUtil.ts";

export function handleWebsocket(socket: WebSocket) {
  let auth : websocketCamAuth | websocketUserAuth | undefined = undefined
  socket.addEventListener("message",(ev: MessageEvent<any>)=>{
       auth = JSON.parse(ev.data)

      if(isWebsocketCamAuth(auth)){
        
      }else if(isWebsocketUserAuth(auth)){

      }
      else{
        socket.close(undefined, "bad first message")
      }
  })
}
