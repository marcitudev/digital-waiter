CREATE TABLE IF NOT EXISTS phone_numbers(
    id SERIAL PRIMARY KEY,
    ddd VARCHAR NOT NULL CHECK(LENGTH(ddd) = 3),
    phone_number VARCHAR NOT NULL CHECK(LENGTH(phone_number) = 9 AND phone_number ~ '^[0-9]+$')
);