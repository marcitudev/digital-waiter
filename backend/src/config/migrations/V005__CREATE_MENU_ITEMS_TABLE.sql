CREATE TABLE IF NOT EXISTS menu_items(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL CHECK(LENGTH(name) >= 3 AND LENGTH(name) <= 255),
	description VARCHAR(255) NOT NULL CHECK(LENGTH(description) >= 3 AND LENGTH(description) <= 255),
	price DECIMAL(10,2) NOT NULL,
	restaurant_id INT NOT NULL,
	available BOOLEAN NOT NULL,
	status BOOLEAN NOT NULL,
	CONSTRAINT fk__restaurant_id__restaurants FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
	CONSTRAINT unique__name__restaurant_id UNIQUE (name, restaurant_id)
)