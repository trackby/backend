DROP TABLE IF EXISTS comment, tvshow, show_comment;

/*comment table */
CREATE TABLE comment(
  id SERIAL,
  body   VARCHAR(255) NOT NULL,
  user_id		INT  NOT NULL,
  parent_id		INT,
  PRIMARY KEY(id)
);

/*show_comment table */
CREATE TABLE show_comment(
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