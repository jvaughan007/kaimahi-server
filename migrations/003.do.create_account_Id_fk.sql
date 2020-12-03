ALTER TABLE leads
add column account_id INTEGER REFERENCES accounts(id);