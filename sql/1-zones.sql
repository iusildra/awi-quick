-- DROP TABLE IF EXISTS zones;
-- CREATE TABLE zones(
--   id INTEGER NOT NULL,
--   num INTEGER DEFAULT 0 NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   PRIMARY KEY (id, num)
-- );
INSERT INTO zone (name)
  VALUES ('Esplanade'), ('Antigone');

INSERT INTO zone_room(name, zone_id) VALUES
  ('Gauche', 1), ('Centre', 1), ('Droite', 1), ('Accueil', 1),
  ('Buvette', 2), ('Entree', 2), ('Fond', 2), ('Proto', 2), ('Loup-Garous', 2);

INSERT INTO room_table(number, room_id) VALUES
  (1, 1), (2, 1), (3, 1),
  (1, 2), (2, 2), (3, 2), (4, 2), (5, 2),
  (1, 3), (2, 3), (3, 3), (4, 3),
  (1, 4),
  (1, 5),
  (1, 6), (2, 6), (3, 6), (4, 6), (5, 6),
  (1, 7), (2, 7),
  (1, 8),
  (1, 9);