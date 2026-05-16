import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
});

export async function checkDB() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (e) {
    console.error("No se pudo conectar a la base de datos:", e);
    process.exit(1); // detenemos el proceso si no hay conexión
  }
}

export async function syncDB() {
  try {
    await sequelize.sync({ alter: true, force: true });
    console.log("base de datos sincronizada");
  } catch (error) {
    console.error("no se ha podido sincronizar", error);
  }
}

export default sequelize;