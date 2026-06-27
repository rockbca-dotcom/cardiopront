import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  __mysqlPool?: mysql.Pool;
};

export const db =
  globalForDb.__mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cardiopront",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mysqlPool = db;
}

export default db;
