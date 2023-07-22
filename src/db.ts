import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://alpyroot:AtPf9bnRuR84zWC09QI0cY9wDFDzuNKM@dpg-ciu3cbtiuiedpv6vdtgg-a/lbbdatabase"
});

export default pool;
