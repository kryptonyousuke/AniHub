import Database from "better-sqlite3";

export class AnihubDatabase {
  
  /*
  * 
  *     Create a entire database if it does not exist
  *     and initialize vars.
  * 
  */

  constructor(dbPath) {
    this.dbPath = dbPath;
    console.log("Starting database.");
    this.db = new Database(this.dbPath, { verbose: console.log })
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        command_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        keyvisual_url TEXT NOT NULL,
        nsfw INTEGER NOT NULL CHECK (nsfw IN (0,1)),
        type TEXT NOT NULL CHECK (type IN ('anime', 'manga'))
      );
      
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY,
        command_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        keyvisual_url TEXT NOT NULL,
        nsfw INTEGER NOT NULL CHECK (nsfw IN (0,1)),
        type TEXT NOT NULL CHECK (type IN ('anime', 'manga')),
        last_access INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_favorites_type ON favorites(type);
      CREATE INDEX IF NOT EXISTS idx_history_last_access ON history(last_access DESC);
    `);
  }
  
  /*
  *     Store the anime/manga data on favorite table. 
  */
  storeFavorite(command_id, name, keyvisual_url, nsfw, type) {
    const result = this.db.prepare(`
          INSERT OR IGNORE INTO favorites ( command_id, name, keyvisual_url, nsfw, type ) VALUES ( ?, ?, ?, ?, ? );
      `).run(command_id, name, keyvisual_url, nsfw, type);
    return result.changes === 1;
  }
  
  /*
  *     Store the anime/manga data on history table. 
  */
  storeHistory(command_id, name, keyvisual_url, nsfw, type, timestamp) {
    this.db.prepare(` 
      INSERT INTO history ( command_id, name, keyvisual_url, nsfw, type, last_access ) VALUES (?, ?, ?, ?, ?, ?) 
      ON CONFLICT(command_id)
      DO UPDATE SET last_access = excluded.last_access; `).run(command_id, name, keyvisual_url, nsfw, type, timestamp);
  }
  
  getFavorites() {
    return this.db.prepare("SELECT * FROM favorites;").all();
  }
  
  getHistory() {
    return this.db.prepare("SELECT * FROM history ORDER BY last_access DESC;").all();
  }
  
  deleteFavoriteById(id) {
    const result = this.db.prepare("DELETE FROM favorites WHERE id = ?").run(id);
  }
  
  deleteHistoryById(id) {
    const result = this.db.prepare("DELETE FROM history WHERE id = ?").run(id);
  }
  
  close() {
    console.log("Closing database.")
    this.db.close();
  }
  
}