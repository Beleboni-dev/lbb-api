import { Pool } from "pg";
const pool = new Pool({
  user: "alpyroot",
  host: "localhost",
  database: "lbbdatabase",
  password: "AtPf9bnRuR84zWC09QI0cY9wDFDzuNKM",
  port: 5432, // Porta padrão do PostgreSQL
});
export default pool;
