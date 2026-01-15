import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../data/x402.db");
export const db = new sqlite3.Database(dbPath);

export const initDb = () => {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run(`
        CREATE TABLE IF NOT EXISTS x402_payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tx_hash TEXT UNIQUE,
          agent_id TEXT,
          amount TEXT,
          currency TEXT,
          status TEXT,
          reason TEXT,
          metadata TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err: any) => {
                if (err) {
                    console.error("Failed to create table:", err);
                    reject(err);
                } else {
                    console.log("Database initialized successfully.");
                    resolve();
                }
            });
        });
    });
};
