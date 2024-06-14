CREATE TABLE IF NOT EXISTS orders(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	restaurant_id INT NOT NULL,
	order_number INT NOT NULL CHECK(LENGTH(CAST(order_number AS VARCHAR)) = 10),
	datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	payment_method_id INT NOT NULL,
	shipping_price DECIMAL(10,2) NOT NULL,
	final_price DECIMAL(10,2) NOT NULL,
	CONSTRAINT fk__user_id__users FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT fk__restaurant_id__restaurants FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
	CONSTRAINT fk__payment_method_id__payment_methods FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
)