/// <reference path="./types/express.d.ts" />

import express, { Request, Response } from "express";
import { userRoutes } from "./routes/userRoutes";
import cors from "cors"
import connectDB from "./db";
const app = express();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use(express.json());
app.use(cors())
app.get("/", (req: Request, res: Response) => {
  res.send("API funcionando");
});

app.use("/", userRoutes);
connectDB()