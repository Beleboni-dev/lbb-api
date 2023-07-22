import { Pool } from "pg";

const pool = new Pool({
  user: "alpyroot",
  host: "dpg-ciu3cbtiuiedpv6vdtgg-a", // Endereço do banco de dados no Render
  database: "lbbdatabase", // Nome do banco de dados
  password: "AtPf9bnRuR84zWC09QI0cY9wDFDzuNKM", // Substitua pela sua senha do banco de dados
  port: 5432, // Porta padrão do PostgreSQL
});

export default pool;
