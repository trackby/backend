DROP TABLE IF EXISTS comment, tvshow, episode, season, show_comment, season_comment, episode_comment, show_watch, season_watch, episode_watch, watch, users, friendship, reaction, comment_reaction, rate, show_rate, season_rate, episode_rate CASCADE;
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
  show_name	CITEXT NOT NULL,
  comment_id  INT NOT NULL,
  PRIMARY KEY(comment_id)
);

/*season_comment table */
CREATE TABLE season_comment (
  show_name	CITEXT NOT NULL,
  season_no INT NOT NULL,
  comment_id  INT NOT NULL,
  PRIMARY KEY(comment_id)
);

/*episode_ table */
CREATE TABLE episode_comment (
  show_name	CITEXT NOT NULL,
  season_no INT NOT NULL,
  episode_no INT NOT NULL,
  comment_id  INT NOT NULL,
  PRIMARY KEY(comment_id)
);


/*tvshow table */
CREATE TABLE tvshow (
    id SERIAL,
    info	TEXT,
    show_name	CITEXT NOT NULL,
    director_name VARCHAR(45),
    writer_name VARCHAR(45),
    image_url	TEXT,
    trailer_url VARCHAR(75),
    season_count INT DEFAULT 0,
    episode_count INT DEFAULT 0,
    overall_rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(show_name)
);

/*season table */
CREATE TABLE season(
	  id 		SERIAL,
    season_no     INT NOT NULL,
    info		TEXT,
    season_year	    INT,
    image_url	TEXT,
    overall_rating FLOAT DEFAULT 0.0,
    trailer_url     VARCHAR(75),
    show_name	CITEXT NOT NULL,
    episode_count  INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(show_name, season_no)
);

/*episode table */
CREATE TABLE episode(
	  id 	SERIAL,
	  episode_no   	INT   NOT NULL,
    episode_name	VARCHAR(45) NOT NULL,
    info	TEXT,
    image_url	TEXT,
    overall_rating FLOAT DEFAULT 0.0,
    trailer_url VARCHAR(75),    
    season_no		INT NOT NULL,
    show_name	CITEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(show_name, season_no, episode_no)
);

CREATE TABLE watch (
  id SERIAL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);

CREATE TABLE show_watch (
  watch_id INT,
  show_name	CITEXT,
  PRIMARY KEY(watch_id)
);

CREATE TABLE season_watch (
  watch_id INT,
  show_name	CITEXT NOT NULL,
  season_no INT,
  PRIMARY KEY(watch_id)
);

CREATE TABLE episode_watch (
  watch_id INT,
  show_name	CITEXT NOT NULL,
  season_no INT,
  episode_no INT,
  PRIMARY KEY(watch_id)
);

CREATE TABLE users (
  id SERIAL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  image_url TEXT,
  role VARCHAR(20) DEFAULT 'REGISTERED_USER' CHECK (role IN ('REGISTERED_USER', 'ADMIN', 'MODERATOR')),
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
  PRIMARY KEY(reaction_id)
);


/*rate table */
CREATE TABLE rate(
	id		SERIAL,
	user_id		INT NOT NULL,
	rating   FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);

/*show_rate table */
CREATE TABLE show_rate(
  show_name	CITEXT NOT NULL,
	rate_id	INT NOT NULL,
  PRIMARY KEY(rate_id)
);

CREATE TABLE season_rate(
  show_name	CITEXT NOT NULL,
  season_no INT NOT NULL,
	rate_id	INT NOT NULL,
  PRIMARY KEY(rate_id)
);


CREATE TABLE episode_rate(
 show_name	CITEXT NOT NULL,
 season_no INT NOT NULL,
 episode_no INT NOT NULL,
 rate_id	INT NOT NULL,
 PRIMARY KEY(rate_id)
);

-- Migrations 
ALTER TABLE season
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name);


ALTER TABLE episode
  ADD FOREIGN KEY(season_no, show_name) REFERENCES season(season_no, show_name),
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name);

ALTER TABLE rate
  ADD FOREIGN KEY(user_id) REFERENCES users(id);

ALTER TABLE show_rate
  ADD FOREIGN KEY(rate_id) REFERENCES rate(id),
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name);

ALTER TABLE season_rate
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(show_name, season_no) REFERENCES season(show_name, season_no) ON DELETE CASCADE,
  ADD FOREIGN KEY(rate_id) REFERENCES rate(id) ON DELETE CASCADE;

ALTER TABLE episode_rate
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(season_no, show_name) REFERENCES season(season_no, show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(episode_no, season_no, show_name) REFERENCES episode(episode_no, season_no, show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(rate_id) REFERENCES rate(id) ON DELETE CASCADE;


ALTER TABLE comment
  ADD FOREIGN KEY(parent_id) REFERENCES comment(id),
  ADD FOREIGN KEY(user_id) REFERENCES users(id);

ALTER TABLE friendship
  ADD FOREIGN KEY(first_user_id) REFERENCES users(id)  ON UPDATE CASCADE ON DELETE CASCADE,
  ADD FOREIGN KEY(second_user_id) REFERENCES users(id)  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE show_comment
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;

ALTER TABLE season_comment
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(season_no, show_name) REFERENCES season(season_no, show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;

ALTER TABLE episode_comment
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(season_no, show_name) REFERENCES season(season_no, show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(episode_no, season_no, show_name) REFERENCES episode(episode_no, season_no, show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;


ALTER TABLE show_watch
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(watch_id) REFERENCES watch(id) ON DELETE CASCADE;

ALTER TABLE season_watch
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(show_name, season_no) REFERENCES season(show_name, season_no) ON DELETE CASCADE,
  ADD FOREIGN KEY(watch_id) REFERENCES watch(id) ON DELETE CASCADE;

ALTER TABLE episode_watch
  ADD FOREIGN KEY(show_name) REFERENCES tvshow(show_name) ON DELETE CASCADE,
  ADD FOREIGN KEY(show_name, season_no) REFERENCES season(show_name, season_no) ON DELETE CASCADE,
  ADD FOREIGN KEY(show_name, season_no, episode_no) REFERENCES episode(show_name, season_no, episode_no) ON DELETE CASCADE,
  ADD FOREIGN KEY(watch_id) REFERENCES watch(id) ON DELETE CASCADE;


ALTER TABLE watch
  ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE reaction
  ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE comment_reaction
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(reaction_id) REFERENCES reaction(id) ON DELETE CASCADE;

-- Triggers

-- Functions
CREATE OR REPLACE FUNCTION decrease_episode_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE season SET episode_count = episode_count - 1
    WHERE season.id = OLD.id;
    RETURN NEW;
  END;
  $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION decrease_episode_count_show()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE tvshow SET episode_count = episode_count - 1
    WHERE tvshow.id = OLD.id;
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
    WHERE tvshow.show_name = NEW.show_name;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION decrease_season_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE tvshow SET season_count = season_count - 1
    WHERE tvshow.id = OLD.id;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION increase_episode_count()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE season SET episode_count = episode_count + 1
    WHERE season.id = NEW.id;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION increase_episode_count_show()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE tvshow SET episode_count = episode_count + 1
    WHERE tvshow.id = NEW.id;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';


-- CALCULATE RATING
CREATE OR REPLACE FUNCTION calculate_show_average()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE tvshow SET overall_rating =
    ( SELECT AVG(rate.rating) FROM show_rate INNER JOIN rate
      ON show_rate.rate_id = rate.id
    );
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calculate_episode_average()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE episode SET overall_rating =
    ( SELECT AVG(rate.rating) FROM episode_rate INNER JOIN rate
      ON episode_rate.rate_id = rate.id
    );
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calculate_season_average()
  RETURNS trigger AS
  $$
  BEGIN
    UPDATE season SET overall_rating =
    ( SELECT AVG(rate.rating) FROM season_rate INNER JOIN rate
      ON season_rate.rate_id = rate.id
    );
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

CREATE TRIGGER inc_episode_count_show_trigger
  AFTER INSERT
  ON episode
  FOR EACH ROW
  EXECUTE PROCEDURE increase_episode_count_show();

CREATE TRIGGER dec_episode_count_trigger
  AFTER DELETE
  ON episode
  FOR EACH ROW
  EXECUTE PROCEDURE decrease_episode_count();

CREATE TRIGGER dec_episode_count_show_trigger
  AFTER DELETE
  ON episode
  FOR EACH ROW
  EXECUTE PROCEDURE decrease_episode_count_show();

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


CREATE TRIGGER calculate_show_average_trigger
  AFTER INSERT OR UPDATE ON rate
  EXECUTE PROCEDURE calculate_show_average();

CREATE TRIGGER calculate_episode_average_trigger
  AFTER INSERT OR UPDATE ON rate
  EXECUTE PROCEDURE calculate_episode_average();

CREATE TRIGGER calculate_season_average_trigger
  AFTER INSERT OR UPDATE ON rate
  EXECUTE PROCEDURE calculate_season_average();

-- INDEXES
CREATE INDEX show_comment_index ON show_comment(comment_id);
CREATE INDEX season_comment_index ON season_comment(comment_id);
CREATE INDEX episode_comment_index ON episode_comment(comment_id);
CREATE INDEX watch_index ON show_watch(watch_id);
CREATE INDEX season_watch_index ON season_watch(watch_id);
CREATE INDEX episode_watch_index ON episode_watch(watch_id);
CREATE INDEX show_rate_index ON show_rate(rate_id);
CREATE INDEX season_rate_index ON season_rate(rate_id);
CREATE INDEX episode_rate_index ON episode_rate(rate_id);
CREATE INDEX comment_reaction_index ON comment_reaction(reaction_id);
CREATE INDEX showname_index ON tvshow (show_name);
CREATE INDEX episode_no_index ON episode USING btree (episode_no);
CREATE INDEX season_no_index ON season USING btree (season_no);


-- VIEWS

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

CREATE VIEW episode_comments AS (
  SELECT episode.show_name, episode.season_no, episode.episode_no, comment.comment_body, 
    comment.created_at, comment.user_id, 'episode_comment' AS type FROM episode_comment
  INNER JOIN episode ON episode_comment.show_name = episode.show_name 
    AND episode_comment.season_no = episode.season_no 
    AND episode_comment.episode_no = episode.episode_no
  INNER JOIN comment ON episode_comment.comment_id = comment.id
  INNER JOIN users ON comment.user_id = users.id 
);

CREATE VIEW subcomments AS (
  SELECT parent.comment_body as parent_body, users.username, users.image_url, sub.comment_body, 
    sub.subcomment_count, sub.user_id, sub.created_at, 'subcomment' AS type FROM comment parent 
  INNER JOIN comment sub ON sub.parent_id = parent.id
  INNER JOIN users ON sub.user_id = users.id
);

CREATE VIEW season_comments AS (
  SELECT users.username, users.image_url, season.show_name, season.season_no, comment.comment_body, 
    comment.user_id, comment.created_at, 'seasoncomment' AS type FROM season_comment
  INNER JOIN season ON season_comment.show_name = season.show_name
    AND season_comment.season_no = season.season_no
  INNER JOIN comment ON season_comment.comment_id = comment.id
  INNER JOIN users ON comment.user_id = users.id
);

CREATE VIEW show_comments AS (
  SELECT users.username, users.image_url, tvshow.show_name, comment.comment_body, 
    comment.created_at, comment.user_id, show_comment.comment_id, 'showcomment' as type FROM show_comment
  INNER JOIN tvshow ON show_comment.show_name = tvshow.show_name
  INNER JOIN comment ON show_comment.comment_id = comment.id
  INNER JOIN users ON comment.user_id = users.id 
);

CREATE VIEW show_watches AS (
  SELECT users.username, tvshow.show_name, watch.created_at, 
    watch.user_id, 'showwatches' as type FROM show_watch
  INNER JOIN tvshow ON show_watch.show_name = tvshow.show_name
  INNER JOIN watch ON show_watch.watch_id = watch.id
  INNER JOIN users ON watch.user_id = users.id
);

CREATE VIEW season_watches AS (
  SELECT users.username, season.show_name, season.season_no, watch.created_at,
    watch.user_id, 'seasonwatches' as type FROM season_watch
  INNER JOIN season ON season_watch.show_name = season.show_name
    AND season_watch.season_no = season.season_no
  INNER JOIN watch ON season_watch.watch_id = watch.id
  INNER JOIN users ON watch.user_id = users.id 
);

CREATE VIEW episode_watches AS (
  SELECT users.username, episode.show_name, episode.season_no, episode.episode_no, watch.created_at,
    watch.user_id, 'episodewatches' as type FROM episode_watch
  INNER JOIN episode ON episode_watch.show_name = episode.show_name
    AND episode_watch.season_no = episode.season_no AND episode_watch.episode_no = episode.episode_no
  INNER JOIN watch ON episode_watch.watch_id = watch.id
  INNER JOIN users ON watch.user_id = users.id
);

CREATE VIEW show_rates AS (
  SELECT users.username, tvshow.show_name, rate.rating, rate.created_at, 
    rate.user_id, 'showrates' as type FROM show_rate
  INNER JOIN tvshow ON show_rate.show_name = tvshow.show_name
  INNER JOIN rate ON show_rate.rate_id = rate.id
  INNER JOIN users ON rate.user_id = users.id 
);

CREATE VIEW season_rates AS (
  SELECT users.username, season.show_name, season.season_no, rate.rating, rate.created_at,
    rate.user_id, 'seasonrates' as type  FROM season_rate
  INNER JOIN season ON season_rate.show_name = season.show_name
    AND season_rate.season_no = season.season_no
  INNER JOIN rate ON season_rate.rate_id = rate.id
  INNER JOIN users ON rate.user_id = users.id 
);

CREATE VIEW episode_rates AS (
  SELECT users.username, episode.show_name, episode.season_no, episode.episode_no, rate.rating,
    rate.created_at, rate.user_id, 'episoderates' as type  FROM episode_rate
  INNER JOIN episode ON episode_rate.show_name = episode_rate.show_name
    AND episode_rate.season_no = episode.season_no 
    AND episode_rate.episode_no = episode.episode_no
  INNER JOIN rate ON episode_rate.rate_id = rate.id
  INNER JOIN users ON rate.user_id = users.id 
);

