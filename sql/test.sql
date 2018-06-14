INSERT INTO users(username, password, email, isAdmin) VALUES ('alice', 'test', 'test1', true);
INSERT INTO users(username, password, email, isAdmin) VALUES ('bob', 'test', 'test2', true);
INSERT INTO users(username, password, email, isAdmin) VALUES ('gendry', 'test', 'test3', true);
INSERT INTO friendship(first_user_id, second_user_id, status, action_user_id) VALUES(1, 2, 'APPROVED', 1);
INSERT INTO friendship(first_user_id, second_user_id, status, action_user_id) VALUES(1, 3, 'APPROVED', 1);
