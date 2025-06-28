import { generate } from "@alikia/random-key";
import { camDB, RUNTIMEDATA, sessionTokenDB } from "../main.ts";
import {
  cameraAdminData,
  createCamData,
  databaseType,
  deleteCamData,
  loginData,
  sessionTokenData,
} from "../utility/classes.ts";

import { getUnixTime, isValidEmail } from "../utility/util.ts";
import { hash } from "../utility/hash.ts";
import { Authorization } from "../utility/runtimeUtil.ts";

const loginUrlPattern = new URLPattern({ pathname: "/login" });

const createCamUrlPattern = new URLPattern({
  pathname: "/createCam",
});

const deleteCamUrlPattern = new URLPattern({
  pathname: "/deleteCam",
});

export async function post(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
  // LOGIN
  if (loginUrlPattern.test(url)) {
    let data: loginData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }

    if (data.admin) {
      // handle errors and exceptions
      if (data.email) {
        return new Response(
          "if you are trying to log in as admin you cant have an email",
          { status: 403 },
        );
      }
      if (!data.oneTime) {
        return new Response(
          "if you are trying to log in as an admin you can only have a one time login",
          { status: 400 },
        );
      }

      if (data.passwordHash != RUNTIMEDATA.adminPasswordHash) {
        return new Response("wrong password", { status: 401 });
      }
      // ADDS AN ADMIN SESSIONTOKEN

      const newSessionTokenData: sessionTokenData = {
        admin: true,
        expiration: RUNTIMEDATA.settingsData.oneTimeLoginDuration +
          getUnixTime(),
        token: await generate(RUNTIMEDATA.settingsData.tokenLength),
      };

      sessionTokenDB.set([newSessionTokenData.token], newSessionTokenData);
      return new Response(JSON.stringify(newSessionTokenData), { status: 200 });
    } else {
      if (!data.email) {
        return new Response(
          "if you are not logging in as an admin an email is needed",
          { status: 401 },
        );
      }
      if (!isValidEmail(data.email) || !data.email) {
        return new Response(
          "if you are not logging in as an admin a valid email is needed",
          { status: 401 },
        );
      }

      // ADDS A USER SESSION TOKEN

      const cam: databaseType[] = camDB.prepare(
        "SELECT * FROM cameras WHERE email=?",
      ).all(
        data.email,
      );

      console.log(cam[0]);

      if (!cam[0]) {
        return new Response("There is no camera associated with the email", {
          status: 500,
        });
      }

      if (!cam[0].connected) {
        return new Response(
          "You need to turn on your camera (or contact an admin) to be able to login",
          { status: 500 },
        );
      }

      if (cam[0].passwordHash != data.passwordHash) {
        return new Response("Password incorrect", { status: 401 });
      }

      const newSessionTokenData: sessionTokenData = {
        admin: false,
        expiration: (data.oneTime ? RUNTIMEDATA.settingsData.oneTimeLoginDuration : RUNTIMEDATA.settingsData.loginDuration) +
          getUnixTime(),
        token: await generate(RUNTIMEDATA.settingsData.tokenLength),
        camPublicId: cam[0].publicId,
        email: data.email
      };

      sessionTokenDB.set([newSessionTokenData.token], newSessionTokenData);
      return new Response(JSON.stringify(newSessionTokenData), { status: 200 });
    }
  }

  // CREATE CAM
  if (createCamUrlPattern.test(url)) {
    let data: createCamData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }

    const auth = await Authorization.auth(req);

    if (auth instanceof Response) {
      return auth;
    }

    if (!auth.admin) {
      return new Response("unathorized", { status: 401 });
    }
    if (!data.email || !isValidEmail(data.email)) {
      return new Response("invalid email", { status: 400 });
    }

    if (!data.address) {
      return new Response("an address is needed", { status: 400 });
    }

    if (
      camDB.prepare("SELECT * FROM cameras WHERE email=?").all(data.email)
        .length > 0
    ) {
      return new Response("a camera already exsists for this email", {
        status: 500,
      });
    }
    // creates the data for the camera
    const salt = await generate(RUNTIMEDATA.settingsData.saltLength);
    const hashedEmail = hash(data.email, RUNTIMEDATA.settingsData.hashLength);
    const publicId = await generate(RUNTIMEDATA.settingsData.idLength);
    const token = await generate(RUNTIMEDATA.settingsData.tokenLength);

    // puts the data in the database
    camDB.exec(
      `INSERT INTO cameras (token, salt, emailHash, publicId, connected, email, address) VALUES (?, ?, ?, ?, false, ?, ?)`,
      token,
      salt,
      hashedEmail,
      publicId,
      data.email,
      data.address,
    );
    console.log("created cam for email: " + data.email);

    const resp: cameraAdminData[] = camDB.prepare(
      "SELECT token, publicId, salt, connected, email, emailHash, address FROM cameras WHERE token=?",
    ).all(token);
    return new Response(JSON.stringify(resp[0]), { status: 200 });
  }

  if (deleteCamUrlPattern.test(url)) {
    const auth = await Authorization.auth(req);

    if (auth instanceof Response) {
      return auth;
    }

    if (!auth.admin) {
      return new Response("unathorized", { status: 401 });
    }

    let data: deleteCamData;
    try {
      data = JSON.parse(await req.text());
    } catch (_error) {
      return new Response("Bad json in body or no data", { status: 422 });
    }

    if (
      camDB.exec(
        "DELETE FROM cameras WHERE publicId=? AND email=?",
        data.publicId,
        data.email,
      ) != 1
    ) {
      return new Response("Something went wrong, id probably doesnt exist", {
        status: 500,
      });
    }

    return new Response("Deleted camera", { status: 200 });
  }

  return new Response("Bad POST request", { status: 400 });
}
