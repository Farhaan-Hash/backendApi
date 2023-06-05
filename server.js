import express from "express";
import connectDb from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import dotenv from "dotenv/config";
import cors from "cors";

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

// Route
app.use("/auth", authRoute, () => {
  setHeader("Access-Control-Allow-Credentials", "true");
});

// SERVER & DB
app.listen(port, connectDb(), () => console.log(`Server Is Up on ${port}`));
