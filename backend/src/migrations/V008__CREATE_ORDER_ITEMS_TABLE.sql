CREATE TABLE IF NOT EXISTS order_items(
	user_id INT NOT NULL,
	menu_item_id INT NOT NULL,
	amount INT NOT NULL,
	unit_price DECIMAL(10,2) NOT NULL,
	order_id INT NOT NULL,
	CONSTRAINT fk__user_id__users FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT fk__menu_item_id__menu_items FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
	CONSTRAINT fk__order_id__orders FOREIGN KEY (order_id) REFERENCES orders(id)
)