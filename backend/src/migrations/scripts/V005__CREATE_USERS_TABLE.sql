CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL CHECK(LENGTH(first_name) >= 3 AND LENGTH(first_name) <= 50),
	last_name VARCHAR(50) NOT NULL CHECK(LENGTH(last_name) >= 3 AND LENGTH(last_name) <= 50),
	cpf VARCHAR(11) NOT NULL UNIQUE CHECK(LENGTH(cpf) = 11 AND cpf ~ '^[0-9]+$'),
	email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	address_id INT NOT NULL,
	phone_number_id INT NOT NULL,
	status BOOLEAN NOT NULL,
	password BYTEA NOT NULL,
	CONSTRAINT fk__address_id__adresses FOREIGN KEY (address_id) REFERENCES adresses(id),
	CONSTRAINT fk__phone_number_id__phone_numbers FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id)
)