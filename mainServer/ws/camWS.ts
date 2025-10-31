import { camDB, RUNTIMEDATA, sessionTokenDB } from "../main.ts";
import {
  databaseType,
  sessionTokenData,
  websocketCamAuth,
  WSCamUpdate,
  WSPasswordChange,
  WSRelay,
} from "../../shared/classes.ts";
import { isWSPasswordChange, isWSRelay } from "../utility/runtimeUtil.ts";
import { getUnixTime } from "../utility/util.ts";
import { channels } from "./websocket.ts";

/* --------------------------------------------------
   CAMERA AUTH HANDLER
-------------------------------------------------- */
export function handleCameraAuth(socket: WebSocket, auth: websocketCamAuth) {
  if (auth.token.length != RUNTIMEDATA.settingsData.tokenLength) {
    socket.close(1002, "Token length not right");
    return;
  }

  if (auth.publicId.length != RUNTIMEDATA.settingsData.idLength) {
    socket.close(1002, "publicId length not right");
  }

  if (!auth.passwordHash) {
    socket.close(1002, "password hash is required");
  }

  if (auth.passwordHash.length != RUNTIMEDATA.settingsData.hashLength * 4) {
    socket.close(
      1002,
      `password hash wrong length, it should be ${
        RUNTIMEDATA.settingsData.hashLength * 4
      }`,
    );
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

  if (camData[0].publicId != auth.publicId) {
    socket.close(
      1002,
      "unlikely to happen, publicId didnt match the one with that token",
    );
  }

  camDB.exec(
    `UPDATE cameras SET connected=1, passwordHash='${auth.passwordHash}' WHERE token='${auth.token}'`,
  );
  const camUpdate: WSCamUpdate = {
    address: camData[0].address,
    email: camData[0].email,
    emailHash: camData[0].emailHash,
    connectedUsers: 0,
  };

  socket.send(JSON.stringify(camUpdate));

  channels[camData[0].publicId] = {
    cameraSocket: socket,
    connectedUserSockets: [],
  };

  const token = auth.token;

  socket.addEventListener("close", async () => {
    await handleCameraDisconnect(camData[0].publicId, token);
  });

  socket.addEventListener("error", () => {
    socket.close();
  });
}

/* --------------------------------------------------
   CAMERA DISCONNECT HANDLER
-------------------------------------------------- */
export async function handleCameraDisconnect(publicId: string, token: string) {
  const everyKey: Deno.KvEntry<sessionTokenData>[] = await Array.fromAsync(
    sessionTokenDB.list({ prefix: [] }),
  );

  const curTime: number = getUnixTime();
  for (let i = 0; i < everyKey.length; i++) {
    if (
      publicId == everyKey[i].value.camPublicId ||
      everyKey[i].value.expiration < curTime
    ) {
      sessionTokenDB.delete(everyKey[i].key);
    }
  }

  channels[publicId].connectedUserSockets.forEach((userSocket) => {
    userSocket.close(1001, "camera disconnected");
  });

  camDB.exec(
    `UPDATE cameras SET connected=0, passwordHash=null WHERE token='${token}'`,
  );

  delete channels[publicId];
}

/* --------------------------------------------------
   CAMERA MESSAGE HANDLER
-------------------------------------------------- */
export async function handleCameraMessage(
  socket: WebSocket,
  ev: MessageEvent<any>,
  auth: websocketCamAuth,
) {
  // MESSAGE FROM CAM

  let data: WSRelay | WSPasswordChange;

  try {
    data = JSON.parse(ev.data);
    if (!data) {
      throw "";
    }
  } catch (error) {
    socket.close(1002, "bad json or no json");
    return;
  }

  if (isWSPasswordChange(data)) {
    if (data.passwordHash.length != RUNTIMEDATA.settingsData.hashLength * 4) {
      socket.close(1002, "bad length of password hash");
      return;
    }

    camDB.exec(
      "UPDATE cameras SET passwordHash=? WHERE token=?",
      data.passwordHash,
      auth.token,
    );

    const everyKey: Deno.KvEntry<sessionTokenData>[] = await Array.fromAsync(
      sessionTokenDB.list({ prefix: [] }),
    );

    const curTime: number = getUnixTime();
    for (let i = 0; i < everyKey.length; i++) {
      if (
        auth.publicId == everyKey[i].value.camPublicId ||
        everyKey[i].value.expiration < curTime
      ) {
        sessionTokenDB.delete(everyKey[i].key);
      }
    }

    channels[auth.publicId].connectedUserSockets.forEach((userSocket) => {
      userSocket.close(1001, "password changed");
    });


  } else if (isWSRelay(data)) {


  } else {
    socket.close(1002, "bad format of json");
  }
}

export function updateCamData(publicId: string) {
  if (!channels[publicId]) {
    return;
  }

  const camData: databaseType[] = camDB.prepare(
    `SELECT * FROM cameras WHERE publicId=?`,
  ).all(publicId) as databaseType[];

  const updateCamData: WSCamUpdate = {
    address: camData[0].address,
    connectedUsers: channels[publicId].connectedUserSockets.length,
    email: camData[0].email,
    emailHash: camData[0].emailHash,
  };

  channels[publicId].cameraSocket.send(JSON.stringify(updateCamData));
}
