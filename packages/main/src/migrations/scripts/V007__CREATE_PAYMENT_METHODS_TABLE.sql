CREATE TABLE IF NOT EXISTS payment_methods(
	id SERIAL PRIMARY KEY,
	card_brand VARCHAR(255) NOT NULL CHECK(LENGTH(card_brand) >= 3 AND LENGTH(card_brand) <= 255),
	method INT NOT NULL CHECK(method >= 0 AND method <= 3)
)