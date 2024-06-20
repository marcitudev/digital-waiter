CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL CHECK(LENGTH(first_name) >= 3 AND LENGTH(first_name) <= 50),
	last_name VARCHAR(50) NOT NULL CHECK(LENGTH(last_name) >= 3 AND LENGTH(last_name) <= 50),
	cpf INT NOT NULL UNIQUE CHECK(LENGTH(CAST(cpf AS VARCHAR)) = 11),
	email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	status BOOLEAN NOT NULL,
	password BYTEA NOT NULL
)