-- DROP TABLE IF EXISTS zones;

-- CREATE TABLE zones(
--   id INTEGER NOT NULL,
--   num INTEGER DEFAULT 0 NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   PRIMARY KEY (id, num)
-- );

INSERT INTO zones VALUES
  -- Esplanade-Gauche --
  (1, 1, 'Esplanade-Gauche', NOW(), NOW()),
  (1, 2, 'Esplanade-Gauche', NOW(), NOW()),
  (1, 3, 'Esplanade-Gauche', NOW(), NOW()),
  -- Esplanade-Centre --
  (2, 1, 'Esplanade-Centre', NOW(), NOW()),
  (2, 2, 'Esplanade-Centre', NOW(), NOW()),
  (2, 3, 'Esplanade-Centre', NOW(), NOW()),
  (2, 4, 'Esplanade-Centre', NOW(), NOW()),
  (2, 5, 'Esplanade-Centre', NOW(), NOW()),
  -- Esplanade-Droite --
  (3, 1, 'Esplanade-Droite', NOW(), NOW()),
  (3, 2, 'Esplanade-Droite', NOW(), NOW()),
  (3, 3, 'Esplanade-Droite', NOW(), NOW()),
  (3, 4, 'Esplanade-Droite', NOW(), NOW()),
  -- Esplanade-Accueil --
  (4, 0, 'Esplanade-Accueil', NOW(), NOW()),
  -- Antigone-Buvette --
  (5, 0, 'Antigone-Buvette', NOW(), NOW()),
  -- Antigone-Entree --
  (6, 1, 'Antigone-Entree', NOW(), NOW()),
  (6, 2, 'Antigone-Entree', NOW(), NOW()),
  (6, 3, 'Antigone-Entree', NOW(), NOW()),
  (6, 4, 'Antigone-Entree', NOW(), NOW()),
  (6, 5, 'Antigone-Entree', NOW(), NOW()),
  -- Antigone-Fond --
  (7, 1, 'Antigone-Fond', NOW(), NOW()),
  (7, 2, 'Antigone-Fond', NOW(), NOW()),
  -- Antigone-Proto --
  (8, 0, 'Antigone-Proto', NOW(), NOW()),
  -- Antigone-Loup-Garous --
  (9, 0, 'Antigone-Loup-Garous', NOW(), NOW());