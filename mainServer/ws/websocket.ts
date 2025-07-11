import { camDB, RUNTIMEDATA } from "../main.ts";
import {
  databaseType,
  type websocketCamAuth,
  type websocketUserAuth,
} from "../utility/classes.ts";
import {
  isWebsocketCamAuth,
  isWebsocketUserAuth,
} from "../utility/runtimeUtil.ts";

export function handleWebsocket(socket: WebSocket) {
  // the auth object of the current websocket
  let auth: websocketCamAuth | websocketUserAuth | undefined = undefined;

  // ON MESSAGE
  socket.addEventListener("message", (ev: MessageEvent<any>) => {
    // IF NOT AUTHORIZED YET
    if (auth == undefined) {
      auth = JSON.parse(ev.data);

      // IF THE CLIENT IS TRYING TO AUTH AS A CAM
      if (isWebsocketCamAuth(auth)) {
        if (auth.token.length != RUNTIMEDATA.settingsData.tokenLength) {
          socket.close(1002, "Token length not right");
          return;
        }

        const camData: databaseType[] = camDB.prepare(
          `SELECT * FROM cameras WHERE token=?`,
        ).all(auth.token) as databaseType[];

        if (!camData || camData.length == 0) {
          socket.close(1011, "Token doesnt exist");
          return;
        }

        if (camData[0].connected) {
          socket.close(1011, "a camera is already connected using this token");
          return;
        }

        camDB.exec(
          `UPDATE cameras SET connected=1, passwordHash='${auth.passwordHash}' WHERE token='${auth.token}'`,
        );

        socket.send(JSON.stringify(camData[0]));

        const token = auth.token;

        socket.addEventListener("close", () => {
          camDB.exec(
            `UPDATE cameras SET connected=0, passwordHash=null WHERE token='${token}'`,
          );
        });

        socket.addEventListener("error", () => {
          camDB.exec(
            `UPDATE cameras SET connected=0, passwordHash=null WHERE token='${token}'`,
          );
          socket.close();
        });
        return;
      } // IF THE CLIENT IS TRYING TO AUTH AS A USER
      else if (isWebsocketUserAuth(auth)) {
      } else {
        socket.close(
          1002,
          "bad first message, it needs to json either websocketCamAuth or websocketUserAuth",
        );
      }
    }
  });
}
