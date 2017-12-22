DROP TABLE IF EXISTS comment, tvshow, show_comment, show_watch, watch, users, friendship CASCADE;
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
  show_id	INT NOT NULL,
  comment_id  INT NOT NULL,
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

/*season table */
CREATE TABLE season(
	  id 		SERIAL,
    season_no       INT NOT NULL,
    season_info		VARCHAR(255),
    season_year	    INT,
    image_url	VARCHAR(75),
    trailer_url     VARCHAR(75),
    show_id		     INT,
    PRIMARY KEY(id)
);

/*episode table */
CREATE TABLE episode(
	  id 	SERIAL,
	  episode_no   	INT   NOT NULL,
    episode_name	VARCHAR(45) NOT NULL,
    episode_info	VARCHAR(255),
    image_url	VARCHAR(75),
    trailer_url VARCHAR(75),    
    season_id		INT,
    show_id	    INT,
    PRIMARY KEY(id)
);

CREATE TABLE watch (
  id SERIAL,
  user_id INT NOT NULL,
  PRIMARY KEY(id)
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

CREATE TABLE friendship (
  first_user_id INT NOT NULL,
  second_user_id INT NOT NULL,
  status CITEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  action_user_id INT NOT NULL,
  PRIMARY KEY(first_user_id, second_user_id),
  CHECK (first_user_id < second_user_id)
);

CREATE VIEW friends_view AS (
  SELECT first_user_id, second_user_id FROM friendship WHERE status='APPROVED'
  UNION ALL 
  SELECT second_user_id, first_user_id FROM friendship WHERE status='APPROVED'
  ORDER BY first_user_id, second_user_id
);

CREATE VIEW public_user AS (
  SELECT * FROM users WHERE isAdmin=false
);

CREATE VIEW admin_user AS (
  SELECT * FROM users WHERE isAdmin=true
);

/* migrations */
ALTER TABLE season
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id);

ALTER TABLE episode
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id),
  ADD FOREIGN KEY(season_id) REFERENCES season(id);

ALTER TABLE comment
  ADD FOREIGN KEY(parent_id) REFERENCES comment(id),
  ADD FOREIGN KEY(user_id) REFERENCES users(id);

ALTER TABLE friendship
  ADD FOREIGN KEY(first_user_id) REFERENCES users(id)  ON UPDATE CASCADE ON DELETE CASCADE,
  ADD FOREIGN KEY(second_user_id) REFERENCES users(id)  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE show_comment
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;

ALTER TABLE show_watch
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(watch_id) REFERENCES watch(id) ON DELETE CASCADE;

ALTER TABLE watch
  ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;