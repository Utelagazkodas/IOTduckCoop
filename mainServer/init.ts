import { ensureDirSync, existsSync } from "@std/fs";
import {
  addSalt,
  getInAPassword,
  removeJSONcomments,
} from "./utility/util.ts";
import { Database } from "@db/sqlite";
import { hash } from "../shared/hash.ts";
import { generate } from "@alikia/random-key";
import { runtimeData, settingsData } from "../shared/classes.ts";

if (existsSync("./database")) {
  const resp = prompt(
    "Are you sure you want to continue? [y/N]\nA database already exists, this operation is irreversible",
  )?.toLowerCase();

  if (!(resp == "y" || resp == "yes")) {
    Deno.exit();
  }
}

// get in admin password

const adminPassword = getInAPassword("Admin password: ");

if (adminPassword != getInAPassword("Admin password again: ")) {
  throw "Passwords didnt match, no changes were made, aborting initialisation";
}

// gets in settings

const settings: settingsData = JSON.parse(
  removeJSONcomments(Deno.readTextFileSync("./settings.json")),
);

// removes the database
try {
  Deno.removeSync("./database", { recursive: true });
} catch (_error) { /**/ }

ensureDirSync("./database");

// creates the sql database
const camdb = new Database("./database/cam.db", { create: true });
camdb.exec(
  `CREATE TABLE cameras (publicId VARCHAR(${settings.idLength}) NOT NULL PRIMARY KEY, token VARCHAR(${settings.tokenLength}) NOT NULL, salt VARCHAR(${settings.saltLength}), connected BOOLEAN NOT NULL, email VARCHAR(254) NOT NULL, emailHash VARCHAR(${settings.hashLength*3}) NOT NULL, passwordHash VARCHAR(${settings.hashLength*3}), address TEXT NOT NULL)`,
);

// hashes the password and stores the data
const adminSalt = await generate(settings.saltLength);

const adminPasswordHash = hash(
  addSalt(adminPassword, adminSalt),
  settings.hashLength,
);

const data: runtimeData = {
  adminPasswordHash,
  adminSalt,
  settingsData: settings
};

Deno.writeTextFile("./database/data.json", JSON.stringify(data));

const sessionkv = await Deno.openKv("./database/sessionTokens.kv");
sessionkv.close();
