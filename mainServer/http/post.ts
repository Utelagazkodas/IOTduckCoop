import { generate } from "@alikia/random-key";
import { RUNTIMEDATA, sessionTokenDB } from "../main.ts";
import { loginData, sessionTokenData } from "../utility/classes.ts";
import { addSessionToken } from "../utility/runtimeUtil.ts";
import { getUnixTime, isValidEmail } from "../utility/util.ts";

const loginUrlPattern = new URLPattern({ pathname: "/login" });

export async function post(
  req: Request,
  inf: Deno.ServeHandlerInfo<Deno.NetAddr>,
  url: URL,
): Promise<Response> {
  if (loginUrlPattern.test(url)) {
    const data: loginData = JSON.parse(await req.text());

    if (data.admin) {
      // handle errors and exceptions
      if (!data.email) {
        return new Response(
          "if you are trying to log in as admin you cant have an email",
          { status: 403 },
        );
      }
      if (!data.oneTime) {
        return new Response(
          "if you are trying to log in as an admin you can only have a one time login",
        );
      }

      if (data.passwordHash != RUNTIMEDATA.adminPasswordHash) {
        return new Response("wrong password", { status: 401 });
      }
      // ADDS AN ADMIN SESSIONTOKEN

      const newSessionTokenData : sessionTokenData = {admin: true, expiration: RUNTIMEDATA.settingsData.oneTimeLoginDuration + getUnixTime(), token : await generate(RUNTIMEDATA.settingsData.tokenLength)}

      sessionTokenDB.set([newSessionTokenData.token], newSessionTokenData)

    } else {
      if (data.email) {
        if (!isValidEmail(data.email)) {
          return new Response(
            "if you are not logging in as an admin a valid email is needed",
            { status: 401 },
          );
        }

        // ADDS A USER SESSION TOKEN
      } else {
        return new Response(
          "if you are not logging in as an admin an email is needed",
          { status: 401 },
        );
      }
    }
  }

  return new Response("Bad POST request", { status: 400 });
}
