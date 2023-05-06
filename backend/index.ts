import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userController from "./router/User";
dotenv.config();

const PORT = process.env.PORT || null;
const DB_URL = process.env.DB_URL || null;
const SECRET_KEY = process.env.SECRET_KEY || null;

export const app = express();

/**
 * configuration
 */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:5173" }));

if (!PORT) throw new Error("Check your .env file PORT is not defined !!!");
if (!DB_URL) throw new Error("DB_URL is not defined !!!");
if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined !!!");
/**
 * routing
 */
app.get("/", async (req: express.Request, res: express.Response) => {
  res.send({ success: true, message: "Welcome to Authentication Service" });
});

app.use("/api_v1", userController);

/**
 * database
 */
try {
  const connect = (async function () {
    await mongoose.connect(DB_URL);
  })();
} catch (err) {
  console.error(err);
}
const connection = mongoose.connection;
connection.on("error", (err) => {
  console.error(err);
});
connection.once("connected", () => console.log("Connected to database"));
connection.on("reconnected", () => console.log("Reconnecting to database"));
connection.on("disconnected", () => console.log("Disconnected from database"));

app.listen(PORT!, () => console.log(`Server started on ${PORT}`));
