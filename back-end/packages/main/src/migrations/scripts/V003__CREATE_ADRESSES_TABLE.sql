CREATE TABLE IF NOT EXISTS adresses(
	id SERIAL PRIMARY KEY,
	street VARCHAR(255) NOT NULL CHECK(LENGTH(street) >= 3 AND LENGTH(street) <= 255),
	neighbourhood VARCHAR(255) NOT NULL CHECK(LENGTH(neighbourhood) >= 3 AND LENGTH(neighbourhood) <= 255),
	city_id INT NOT NULL,
	number INT
)