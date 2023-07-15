import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import userModel from "../models/user.model";
import * as bcrypt from "bcrypt";

const secret: Secret = "minhachavesecreta";

// Controlador para fazer login do usuário
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials mail" });
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials pass" });
    }

    // Gera um token JWT
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "6h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
