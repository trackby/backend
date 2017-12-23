/* 
INNER JOIN season ON season.show_id = tvshow.id
INNER JOIN episode ON episode.show_id = tvshow.id
 */

DROP MATERIALIZED VIEW IF EXISTS search_index, unique_lexeme CASCADE;
CREATE EXTENSION pg_trgm;

CREATE MATERIALIZED VIEW search_index AS 
SELECT tvshow.id,
       tvshow.show_name,
       setweight(to_tsvector(tvshow.show_name), 'A') ||
       setweight(to_tsvector(tvshow.info), 'B') 
AS document
FROM tvshow 
GROUP BY tvshow.id, tvshow.show_name;

CREATE INDEX idx_fts_search ON search_index USING gin(document);

CREATE MATERIALIZED VIEW unique_lexeme AS
SELECT word FROM ts_stat(
'SELECT to_tsvector(tvshow.show_name) || 
        to_tsvector(tvshow.info)
FROM tvshow
GROUP BY tvshow.id, tvshow.show_name');

CREATE INDEX words_idx ON unique_lexeme USING gin(word gin_trgm_ops);

REFRESH MATERIALIZED VIEW search_index;
REFRESH MATERIALIZED VIEW unique_lexeme;