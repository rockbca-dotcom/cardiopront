import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { join } from "path";

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  console.log("Connected to MySQL. Creating schema...");

  const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  await connection.query(schema);
  console.log("Schema created successfully.");

  const seedExams = readFileSync(join(__dirname, "seed-exams.sql"), "utf-8");
  await connection.query(seedExams);
  console.log("Exams seed loaded.");

  const seedDrugs = readFileSync(join(__dirname, "seed-drugs.sql"), "utf-8");
  await connection.query(seedDrugs);
  console.log("Drugs seed loaded.");

  await connection.end();
  console.log("Setup complete!");
}

setup().catch(console.error);
