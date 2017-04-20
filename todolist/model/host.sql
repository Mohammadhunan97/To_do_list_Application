-- createdb todo_db

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- CREATE TABLE users(
-- id	SERIAL PRIMARY KEY,
-- username VARCHAR(20) NOT NULL UNIQUE,
-- remote TEXT NOT NULL
-- );


-- CREATE TABLE posts(
-- id SERIAL PRIMARY KEY,
-- description TEXT NOT NULL,
-- r_userid INTEGER, FOREIGN KEY (r_userid) references users(id)
-- );