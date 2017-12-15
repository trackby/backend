ALTER TABLE comment
  ADD FOREIGN KEY (parent_id) REFERENCES comment(id);

ALTER TABLE show_comment
  ADD FOREIGN KEY(show_id) REFERENCES tvshow(id) ON DELETE CASCADE,
  ADD FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE;