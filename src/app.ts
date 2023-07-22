import express, { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import cors from "cors";
import pool from "./db";
import { User } from "./interfaces/UserInterface";
import crypto from 'crypto'
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use(express.json());

app.use(cors());

const generateUniqueUserId = (name: string, email: string): string =>  {
  const dataToHash = name + email;
  const hash = crypto.createHash("md5").update(dataToHash).digest("hex");
  return hash;
}

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query<User>("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao consultar o banco de dados:", err);
    res.status(500).json({ error: "Erro ao consultar o banco de dados" });
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, birthdate } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Usuário já cadastrado" });
    }
    // Criptografar a senha usando bcrypt
    const saltRounds = 10; // O número de rounds de salt para gerar o hash
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = generateUniqueUserId(name, email);

    const result = await pool.query(
      "INSERT INTO users (uuid, name, email, password, birthdate) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, name, email, hashedPassword, birthdate]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário com o email fornecido existe no banco de dados
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // Se o usuário não for encontrado, retornar uma resposta com status 401 (Não Autorizado)
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verificar se a senha fornecida está correta
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    // Se a senha estiver incorreta, retornar uma resposta com status 401 (Não Autorizado)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const userId = user.rows[0].uuid
  
    const authToken = jwt.sign({userId}, "minhachavesecreta")
    // Se o usuário existir e a senha estiver correta, retornar uma resposta com status 200 (OK)
    res.status(200).json({ uuid: userId, authToken: authToken});
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

