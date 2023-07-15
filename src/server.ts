/// <reference path="./types/express.d.ts" />

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { userRoutes } from "./routes/userRoutes";
import cors from "cors"
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())
app.get("/", (req: Request, res: Response) => {
  res.send("API funcionando");
});

app.use("/", userRoutes);

mongoose
  .connect("mongodb://localhost:27017/lbb")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor API LBB rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
