CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer default 0
);

INSERT INTO blogs (author, url, title) VALUES ('1', '1', '1');

INSERT INTO blogs (author, url, title) VALUES ('2', '2', '2');