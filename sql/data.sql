INSERT INTO festival (id, name, year, duration)
VALUES 
  ('a59ab81c-57de-42a9-9b4f-c7f107a42de1', 'FestiGame 1', 2023, 3),
  ('b70bc92d-57de-42a9-9b4f-c7f107a42de1', 'FestiGame 2', 2023, 4);

INSERT INTO festival_day (festival_id, date, open_at, close_at)
VALUES
  ('a59ab81c-57de-42a9-9b4f-c7f107a42de1', '2023-03-18', '08:00:00', '22:00:00'),
  ('a59ab81c-57de-42a9-9b4f-c7f107a42de1', '2023-03-19', '08:00:00', '22:00:00'),
  ('b70bc92d-57de-42a9-9b4f-c7f107a42de1', '2023-03-18', '08:00:00', '22:00:00'), 
  ('b70bc92d-57de-42a9-9b4f-c7f107a42de1', '2023-03-19', '08:00:00', '22:00:00');

INSERT INTO timeslot ("start", "end", "festival_day_id")
  VALUES 
  ('08:00:00', '10:00:00', 1),
  ('10:00:00', '12:00:00', 1),
  ('12:00:00', '14:00:00', 2),
  ('14:00:00', '16:00:00', 3),
  ('16:00:00', '18:00:00', 2),
  ('18:00:00', '20:00:00', 4);

INSERT INTO volunteer
  VALUES
  ('4dc19446-b660-4096-9cd9-ecd50083fe8f', 'toto', 'Jean', 'Dupont', 'a@a.a', '$2b$10$ANBRYmhqnh2QNxuQOPTxSe8pgSu/YDGHd4MU6LiUXjGyUBDWGpUAi'),
  ('0055d8f1-a902-4e41-b446-1f501f4266d7', 'lapin', 'Jane', 'Dupont', 'b@b.b', '$2b$10$ANBRYmhqnh2QNxuQOPTxSe8pgSu/YDGHd4MU6LiUXjGyUBDWGpUAi'),
  ('ef34f441-5e86-4b92-8167-5a297ad74b27', 'michel', 'JLM', 'Dupont', 'c@c.c', '$2b$10$ANBRYmhqnh2QNxuQOPTxSe8pgSu/YDGHd4MU6LiUXjGyUBDWGpUAi'),
  ('f5b5c5e1-5e86-4b92-8167-5a297ad74b27', 'lucasn', 'Lucas', 'Nouguier', 'lucas.nouguier@protonmail.com', '$2b$10$ANBRYmhqnh2QNxuQOPTxSe8pgSu/YDGHd4MU6LiUXjGyUBDWGpUAi');

UPDATE volunteer SET "isAdmin" = true WHERE id = 'f5b5c5e1-5e86-4b92-8167-5a297ad74b27';

INSERT INTO zone (name)
  VALUES
  ('Esplanade'),
  ('Antigone');

INSERT INTO festival_zone VALUES
  ('a59ab81c-57de-42a9-9b4f-c7f107a42de1', 1, 5), ('a59ab81c-57de-42a9-9b4f-c7f107a42de1', 2, 8), ('b70bc92d-57de-42a9-9b4f-c7f107a42de1', 1, 3), ('b70bc92d-57de-42a9-9b4f-c7f107a42de1', 2, 9);

INSERT INTO volunteer_assignments
  VALUES ('4dc19446-b660-4096-9cd9-ecd50083fe8f', 1, 1, 'a59ab81c-57de-42a9-9b4f-c7f107a42de1'), ('4dc19446-b660-4096-9cd9-ecd50083fe8f', 2, 2, 'a59ab81c-57de-42a9-9b4f-c7f107a42de1'), ('0055d8f1-a902-4e41-b446-1f501f4266d7', 1, 1, 'b70bc92d-57de-42a9-9b4f-c7f107a42de1'), ('0055d8f1-a902-4e41-b446-1f501f4266d7', 2, 2, 'b70bc92d-57de-42a9-9b4f-c7f107a42de1'),('ef34f441-5e86-4b92-8167-5a297ad74b27', 1, 2, 'b70bc92d-57de-42a9-9b4f-c7f107a42de1'), ('ef34f441-5e86-4b92-8167-5a297ad74b27', 2, 2, 'b70bc92d-57de-42a9-9b4f-c7f107a42de1');

