import Database from "better-sqlite3";

let database: Database.Database | undefined;

export function getDatabase() {
  database ??= new Database("data/jiseong-cleaning.db");
  return database;
}
