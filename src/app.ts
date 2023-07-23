import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { User } from "./interfaces/UserInterface";
import crypto from "crypto";
import { Pool } from "pg";
import knex from "knex";
import kConfig from "../knexfile"

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use(express.json());

app.use(cors());

// Verifique se a variável de ambiente DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  console.error('Variável de ambiente DATABASE_URL não definida.');
  process.exit(1);
}
// Configuração do pool do pg usando a variável de ambiente DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Você pode adicionar outras opções aqui, se necessário.
});

const db = knex(kConfig)



async function createUsersTable() {
  try {
    // Utilize a função "up" para executar as migrações
    await db.migrate.up();
    console.log('Migração "users" executada com sucesso.');
  } catch (error) {
    console.error('Erro ao executar a migração "users":', error);
  }
}

createUsersTable();


//Função geradora de uuid baseado no nome e email do usuário;
const generateUniqueUserId = (name: string, email: string): string => {
  const dataToHash = name + email;
  const hash = crypto.createHash("md5").update(dataToHash).digest("hex");
  return hash;
};

// Exemplo de rota para testar a conexão com o banco de dados
app.get('/test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    const currentTime = result.rows[0].current_time;
    client.release();
    res.send(`Conexão estabelecida com sucesso. Hora atual no banco de dados: ${currentTime}`);
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).send('Erro ao estabelecer conexão com o banco de dados.');
  }
});
// Rota para listar todos os usuários
app.get("/users", async (req, res) => {
  try {
    // Use o Knex.js para consultar a tabela de usuários
    const users = await db.select<User>("*").from("users");
    res.json(users);
  } catch (err) {
    console.error("Erro ao consultar o banco de dados:", err);
    res.status(500).json({ error: "Erro ao consultar o banco de dados" });
  }
});
// Rota para criar um novo usuário
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, birthdate } = req.body;

    // Verificar se o usuário com o email fornecido já existe no banco de dados
    const userExists = await db.select<User>("*").from("users").where("email", email).first();

    if (userExists) {
      return res.status(409).json({ error: "Usuário já cadastrado" });
    }

    // Criptografar a senha usando bcrypt
    const saltRounds = 10; // O número de rounds de salt para gerar o hash
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = generateUniqueUserId(name, email);

    // Inserir o novo usuário no banco de dados usando o Knex.js
    const newUser = {
      uuid: userId,
      name: name,
      email: email,
      password: hashedPassword,
      birthdate: birthdate,
    };

    const result = await db.insert(newUser).into("users").returning("*");

    res.json(result[0]);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});
// Rota para fazer login
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário com o email fornecido existe no banco de dados
    const user = await db.select<User>("*").from("users").where("email", email).first();

    // Se o usuário não for encontrado, retornar uma resposta com status 401 (Não Autorizado)
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verificar se a senha fornecida está correta usando bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Se a senha estiver incorreta, retornar uma resposta com status 401 (Não Autorizado)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const userId = user.uuid;

    const authToken = jwt.sign({ userId }, "minhachavesecreta");
    // Se o usuário existir e a senha estiver correta, retornar uma resposta com status 200 (OK)
    res.status(200).json({ uuid: userId, authToken: authToken });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});