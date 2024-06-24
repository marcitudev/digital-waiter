import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password:  process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT as string, 10) || 5432
});

export default pool;