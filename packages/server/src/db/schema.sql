CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255),
  amount DECIMAL(10, 2),
  date DATE,
  account_id INTEGER REFERENCES accounts(id),
  category_id INTEGER REFERENCES categories(id)
);
