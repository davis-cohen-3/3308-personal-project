DROP TABLE IF EXISTS brewery_table CASCADE;
CREATE TABLE IF NOT EXISTS brewery_table (
    id BIGINT NOT NULL PRIMARY KEY,
    brewery_name VARCHAR(50),
    review VARCHAR(200),
    review_date VARCHAR(200)
);