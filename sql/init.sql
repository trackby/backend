DROP TABLE IF EXISTS comment, tvshow, show_comment, users;
CREATE EXTENSION IF NOT EXISTS citext;

/*comment table */
CREATE TABLE comment (
  id SERIAL,
  body   VARCHAR(255) NOT NULL,
  user_id		INT  NOT NULL,
  parent_id		INT,
  PRIMARY KEY(id)
);

/*show_comment table */
CREATE TABLE show_comment (
  id SERIAL,
  show_id	INT  NOT NULL,
  comment_id  INT  NOT NULL,
  PRIMARY KEY(id)
);

/*tvshow table */
CREATE TABLE tvshow (
    id SERIAL,
    info	VARCHAR(255),
    show_name	VARCHAR(45) NOT NULL,
    image_url	VARCHAR(75),
    trailer_url VARCHAR(75),
    PRIMARY KEY(id)
);

CREATE TABLE watch (
  watch_id SERIAL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY(watch_id)
);

CREATE TABLE users (
  id SERIAL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  age SMALLINT,
  isAdmin BOOLEAN NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO users (username, password, email, age, isAdmin) 
VALUES ('Gokcan', 'gHgk54549232Lr3', 'gokcand@gmail.com', 22, true);

/* migrations */
ALTER TABLE comment
  ADD FOREIGN KEY (parent_id) REFERENCES comment(id);

ALTER TABLE show_comment
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;

ALTER TABLE watch
  ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;