import * as fs from 'fs';
import * as path from 'path';
import pool from '../config/db';

const rootPath = __dirname;
const migrationsPath = path.join(rootPath, 'scripts');

export async function execute() {
    await createMigrationsSchemaHistoryTable();

    const files = fs.readdirSync(migrationsPath);

    files.sort();

    for (const [, file] of files.entries()) {
        const validatedFilename = validateFilenamePattern(file);
        if (!validatedFilename) {
            throw new Error(`***ERROR***\n Migration ${file} does not follow the established pattern for the file name`);
        }

        const filePath = path.join(migrationsPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            const alreadyMigrated = await hasAlreadyMigrated(file);

            if (!alreadyMigrated) await apply(file, filePath);
        }
    }
}

function validateFilenamePattern(file: string) {
    const pattern: RegExp = /^V\d{3}__.{2,}\.sql$/;
    return file.match(pattern);
}

async function hasAlreadyMigrated(file: string): Promise<boolean> {
    const query = `SELECT COUNT(*) FROM migrations_schema_history WHERE name = $1`;
    const response = await pool.query(query, [file]);
    const count = Number.parseInt(response.rows[0].count, 10);
    return count > 0;
}

async function createMigrationsSchemaHistoryTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS migrations_schema_history(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            version INT NOT NULL
        )`;

    try {
        await pool.query(query);
    } catch (err) {
        throw new Error(`***ERROR***\n migrations_schema_history not created: ${err}`);
    }
}

async function registerMigrationHistory(file: string) {
    const version = file.split('__')[0].replace('V', '');
    const query = `INSERT INTO migrations_schema_history(name, version) VALUES($1, $2)`;
    try {
        await pool.query(query, [file, version]);
    } catch (err) {
        console.error(`${file} not registered in migrations_schema_history: ${err}`);
    }
}

async function apply(file: string, filePath: string) {
    const sqlScript = fs.readFileSync(filePath, 'utf8');

    try {
        const response = await pool.query(sqlScript);
        if (response) {
            await registerMigrationHistory(file);
            console.log(`Migration ${file} applied`);
        }
    } catch (err) {
        throw new Error(`Migration ${file}: ${err}`);
    }
}