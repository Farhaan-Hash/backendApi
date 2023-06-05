import express from "express";
import connectDb from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import dotenv from "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Route
app.use("/auth", authRoute);

// SERVER & DB
app.listen(`${PORT}`, connectDb(), () =>
  console.log(`Server Is Up on ${PORT}`)
);
