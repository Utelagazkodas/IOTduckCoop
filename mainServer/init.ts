import { ensureDirSync, existsSync } from "@std/fs";
import { getInAPassword, getInAString, removeJSONcomments } from "./util.ts";
import { Database } from "@db/sqlite";

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

const settings: {
  tokenLength: number;
  idLength: number;
  saltLength: number;
  hashLength: number;
} = JSON.parse(removeJSONcomments(Deno.readTextFileSync("./settings.json")));


// removes the database
try {
  Deno.removeSync("./database", { recursive: true });
} catch (_error) { /**/ }

ensureDirSync("./database");

// creates the sql database
const camdb = new Database("./database/sqlite.db", { create: true });
camdb.exec(`CREATE TABLE cameras (token VARCHAR(${settings.tokenLength}) NOT NULL PRIMARY KEY, publicId VARCHAR(${settings.idLength}) NOT NULL, salt VARCHAR(${settings.saltLength}), )`);
