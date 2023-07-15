import { Request, Response } from "express";
import UserModel from "../models/user.model";
import * as bcrypt from "bcrypt";


// Controlador para criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, birthdate, email, password } = req.body;

    // Verifica se o e-mail já está em uso
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "E-mail already exists" });
    }
    // Gera o salt para o bcrypt
    const salt = await bcrypt.genSalt(10); // Defina o número de salt rounds desejado

    // Cria o hash da senha
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria o novo usuário com a senha hash
    const user = new UserModel({ name, birthdate, email, password: hashedPassword });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
