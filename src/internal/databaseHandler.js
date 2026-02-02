import Database from "better-sqlite3";

export class AnihubDatabase {
  
  /*
  * 
  *     Create a entire database if it does not exist
  *     + initialize vars.
  * 
  */

  constructor(dbPath) {
    this.dbPath = dbPath;
    console.log("Starting database.");
    this.db = new Database(this.dbPath, {verbose: console.log});
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS favorites_manga (
          command_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          keyvisual_url TEXT NOT NULL,
          nsfw BOOLEAN NOT NULL
        );
        CREATE TABLE IF NOT EXISTS favorites_anime (
          command_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          keyvisual_url TEXT NOT NULL,
          nsfw BOOLEAN NOT NULL
        );
        CREATE TABLE IF NOT EXISTS anime_history (
          command_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          keyvisual_url TEXT NOT NULL,
          nsfw BOOLEAN NOT NULL
        );
        CREATE TABLE IF NOT EXISTS manga_history (
          command_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          keyvisual_url TEXT NOT NULL,
          nsfw BOOLEAN NOT NULL
        );
    `);
  }
  
  
  
  close() {
    console.log("Closing database.")
    this.db.close();
  }
  
}