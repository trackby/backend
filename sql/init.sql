DROP TABLE IF EXISTS comment, tvshow, show_comment, show_watch, watch, users CASCADE;
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
  PRIMARY KEY(show_id)
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
  user_id INT NOT NULL,
  PRIMARY KEY(watch_id)
);

CREATE TABLE show_watch (
  watch_id INT,
  show_id INT,
  PRIMARY KEY(show_id)
);

CREATE TABLE users (
  id SERIAL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  age SMALLINT NOT NULL,
  isAdmin BOOLEAN DEFAULT false,
  PRIMARY KEY(id)
);

/* migrations */
ALTER TABLE comment
  ADD FOREIGN KEY (parent_id) REFERENCES comment(id);

ALTER TABLE show_comment
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;

ALTER TABLE show_watch
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(watch_id) REFERENCES watch(watch_id) ON DELETE CASCADE;

ALTER TABLE watch
  ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;