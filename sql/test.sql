INSERT INTO users(username, password, email, age, isAdmin) VALUES ('alice', 'test', 'test1', 26, true);
INSERT INTO users(username, password, email, age, isAdmin) VALUES ('bob', 'test', 'test2', 22, true);
INSERT INTO users(username, password, email, age, isAdmin) VALUES ('gendry', 'test', 'test3', 20, true);

INSERT INTO friendship(first_user_id, second_user_id, status, action_user_id) VALUES(1, 2, 'APPROVED', 1);
INSERT INTO friendship(first_user_id, second_user_id, status, action_user_id) VALUES(1, 3, 'APPROVED', 1);
