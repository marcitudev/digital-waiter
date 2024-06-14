CREATE TABLE IF NOT EXISTS adresses(
	id SERIAL PRIMARY KEY,
	road VARCHAR(255) NOT NULL CHECK(LENGTH(road) >= 3 AND LENGTH(road) <= 255),
	neighborhood VARCHAR(255) NOT NULL CHECK(LENGTH(neighborhood) >= 3 AND LENGTH(neighborhood) <= 255),
	city VARCHAR(255) NOT NULL CHECK(LENGTH(city) >= 3 AND LENGTH(city) <= 255),
	state VARCHAR(255) NOT NULL CHECK(LENGTH(state) >= 3 AND LENGTH(state) <= 255),
	number INT
)