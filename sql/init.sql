DROP TABLE IF EXISTS comment, tvshow, episode, season, show_comment, show_watch, watch, users, friendship, reaction, comment_reaction, rate, show_rate, user_profile_photo CASCADE;
CREATE EXTENSION IF NOT EXISTS citext;

/*comment table */
CREATE TABLE comment (
  id SERIAL,
  comment_body   VARCHAR(255) NOT NULL,
  user_id		INT  NOT NULL,
  parent_id		INT,
  subcomment_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    director_name VARCHAR(45),
    writer_name VARCHAR(45),
    image_url	VARCHAR(75),
    trailer_url VARCHAR(75),
    season_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    episode_count  INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE watch (
  id SERIAL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  PRIMARY KEY (first_user_id, second_user_id),
  CHECK (first_user_id < second_user_id)
);

/*reaction table */
CREATE TABLE reaction(
	id		SERIAL,
	reaction_type  CITEXT  NOT NULL  CHECK (
    reaction_type IN ('NONE', 'LIKE', 'LOVE', 'WOW', 'HAHA','SAD', 'ANGRY', 'THANKFUL')
  ),
	user_id		INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);

/*comment_reaction table */
CREATE TABLE comment_reaction(
	comment_id	 INT  NOT NULL,
	reaction_id  INT  NOT NULL,
  PRIMARY KEY(comment_id)
);

/*rate table */
CREATE TABLE rate(
	id		SERIAL,
	user_id		INT NOT NULL,
	rating   FLOAT,
  PRIMARY KEY(id)
);

/*show_rate table */
CREATE TABLE show_rate(
	show_id	INT  NOT NULL,
	rate_id	INT NOT NULL,
  PRIMARY KEY(rate_id)
);

CREATE TABLE user_profile_photo (
  user_id INT NOT NULL,
  image_url TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, image_url)
);

CREATE VIEW friends_view AS (
  SELECT first_user_id, second_user_id FROM friendship WHERE status='APPROVED'
  UNION ALL 
  SELECT second_user_id, first_user_id FROM friendship WHERE status='APPROVED'
  ORDER BY first_user_id, second_user_id
);

CREATE VIEW friendship_requests AS (
  SELECT first_user_id, second_user_id, action_user_id FROM friendship WHERE status='PENDING'
  UNION ALL 
  SELECT second_user_id, first_user_id, action_user_id FROM friendship WHERE status='PENDING'
  ORDER BY first_user_id, second_user_id, action_user_id
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

ALTER TABLE rate
  ADD FOREIGN KEY(user_id) REFERENCES users(id);

ALTER TABLE show_rate
  ADD FOREIGN KEY(rate_id) REFERENCES rate(id),
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

ALTER TABLE reaction
  ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE comment_reaction
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(reaction_id) REFERENCES reaction(id) ON DELETE CASCADE;

/*Triggers */

-- Functions
CREATE OR REPLACE FUNCTION decrease_episode_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE season SET episode_count = episode_count - 1
    WHERE season.id = OLD.season_id;
  RETURN NEW;
  END;
  $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION decrease_subcomment_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE comment SET subcomment_count = subcomment_count - 1  
    WHERE comement.id = OLD.parent_id;
  RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION increase_subcomment_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE comment SET subcomment_count = subcomment_count + 1
    WHERE comment.id = NEW.parent_id;
    RETURN NEW;
  END;
  $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION increase_season_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE tvshow SET season_count = season_count + 1
    WHERE tvshow.id = NEW.show_id;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION decrease_season_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE tvshow SET season_count = season_count - 1
    WHERE tvshow.id = OLD.show_id;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION increase_episode_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE season SET episode_count = episode_count + 1
    WHERE season.id = NEW.season_id;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';


-- SEASON COUNT UPDATE
CREATE TRIGGER inc_season_count_trigger
  AFTER INSERT
  ON season
  FOR EACH ROW
  EXECUTE PROCEDURE increase_season_count();

CREATE TRIGGER dec_season_count_trigger
  AFTER DELETE
  ON season
  FOR EACH ROW
  EXECUTE PROCEDURE decrease_season_count();

-- EPISODE COUNT UPDATE

CREATE TRIGGER inc_episode_count_trigger
  AFTER INSERT
  ON episode
  FOR EACH ROW
  EXECUTE PROCEDURE increase_episode_count();

CREATE TRIGGER dec_episode_count_trigger
  AFTER DELETE
  ON episode
  FOR EACH ROW
  EXECUTE PROCEDURE decrease_episode_count();

-- SUBCOMMENT COUNT UPDATE

CREATE TRIGGER inc_subcomment_count_trigger
  AFTER INSERT
  ON comment
  FOR EACH ROW
  EXECUTE PROCEDURE increase_subcomment_count();

CREATE TRIGGER dec_subcomment_count_trigger
  AFTER DELETE
  ON comment
  FOR EACH ROW
  EXECUTE PROCEDURE decrease_subcomment_count();