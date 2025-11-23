import "@std/dotenv/load";
import {
  isWSCamUpdate,
  isWSToggle,
  requireEnv,
  useIp,
} from "./utility/util.ts";
import {
  databaseType,
  statusData,
  websocketCamAuth,
  WSCamUpdate,
  WSRelay,
  WSToggle,
} from "../shared/classes.ts";
import * as canv from "@gfx/canvas";
import {
  curDoorState,
  curLightState,
  toggleDoor,
  toggleLights,
} from "./raspberryUtil.ts";

export const PORT = Number(requireEnv("PORT"));
export const IP = requireEnv("IP");
export let status: statusData;

try {
  status = JSON.parse(
    await ((await fetch(useIp(IP, "http", "/status"))).text()),
  );

  if (!status) {
    throw "something went wrong";
  }
} catch (error) {
  throw "the server might not be running";
}

export const RUNTIMEDATA: { token: string; publicId: string; salt: string } =
  JSON.parse(Deno.readTextFileSync("./database/data.json"));

export const runtimeKv = await Deno.openKv("./database/runtimeData.kv");

export const ws = new WebSocket(useIp(IP, "ws", "/connect"));

let connectedUsers = 0;

ws.onopen = async (event) => {
  const auth: websocketCamAuth = {
    passwordHash: ((await runtimeKv.get(["passwordHash"])).value) as string,
    token: RUNTIMEDATA.token,
    publicId: RUNTIMEDATA.publicId,
  };

  ws.send(JSON.stringify(auth));
};

ws.onmessage = async (event: MessageEvent) => {
  if (typeof event.data == "string") {
    const data: WSCamUpdate | WSToggle = JSON.parse(event.data);

    if (isWSCamUpdate(data)) {
      connectedUsers = data.connectedUsers;

      await runtimeKv.set(["address"], data.address);
      await runtimeKv.set(["email"], data.email);
      await runtimeKv.set(["emailHash"], data.emailHash);
      
    } else if (isWSToggle(data)) {
      if (data.toggleDoor) {
        toggleDoor();
      }
      if (data.toggleLight) {
        toggleLights();
      }
    }
  }
};

ws.onclose = async (event: CloseEvent) => {
  console.log("closed", event.reason);
};

const data = await Deno.readFile("./test.jpg");
const blob = new Blob([data], { type: "image/jpeg" });

setInterval(() => {
  if (connectedUsers > 0) {
    const toSend = new Blob([
      new Uint8Array([curDoorState, curLightState]),
      blob,
    ]);
    ws.send(toSend);
  }
}, 1000);
