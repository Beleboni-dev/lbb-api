import { Knex } from "knex";
import * as path from "path";
type KnexConfig = Record<string, Knex.Config>;

const kConfig: KnexConfig = {
  development: {
    client: "pg", // Especifica o cliente PostgreSQL
    connection: {
      // Configuração da conexão para o ambiente de desenvolvimento
      host: "localhost", // Substitua pelo endereço do servidor PostgreSQL local (opcional para desenvolvimento)
      port: 5432, // Substitua pela porta do servidor PostgreSQL local (opcional para desenvolvimento)
      database: "lbbdatabase", // Substitua pelo nome do banco de dados local (opcional para desenvolvimento)
      user: "alpyroot", // Substitua pelo nome do usuário do banco de dados local (opcional para desenvolvimento)
      password: "Alpy246810@", // Substitua pela senha do usuário do banco de dados local (opcional para desenvolvimento)
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "migrations"), // Caminho absoluto do diretório de migrações dentro da pasta 'src'
    },
  },
  production: {
    client: "pg", // Especifica o cliente PostgreSQL
    connection: process.env.DATABASE_URL, // Usa a variável de ambiente DATABASE_URL
    migrations: {
      directory: path.resolve(__dirname, "src", "migrations"), // Caminho absoluto do diretório de migrações dentro da pasta 'src'
    },
  },
};

export default kConfig;
