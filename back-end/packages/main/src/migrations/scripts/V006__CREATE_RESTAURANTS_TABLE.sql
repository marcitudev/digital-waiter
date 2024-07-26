CREATE TABLE IF NOT EXISTS restaurants(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL CHECK(LENGTH(name) >= 3 AND LENGTH(name) <= 255),
	created_at DATE NOT NULL,
	cnpj VARCHAR(14) NOT NULL CHECK(LENGTH(cnpj) = 14 AND cnpj ~ '^[0-9]+$'),
	phone_number_id INT NOT NULL UNIQUE,
	address_id INT NOT NULL UNIQUE,
	owner_id INT NOT NULL,
	status BOOLEAN NOT NULL,
	CONSTRAINT fk__phone_number_id__phone_numbers FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id),
	CONSTRAINT fk__address_id__adresses FOREIGN KEY (address_id) REFERENCES adresses(id),
	CONSTRAINT fk__owner_id__users FOREIGN KEY (owner_id) REFERENCES users(id)
)