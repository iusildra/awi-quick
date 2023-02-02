-- DROP TABLE IF EXISTS zones;

-- CREATE TABLE zones(
--   id INTEGER NOT NULL,
--   num INTEGER DEFAULT 0 NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   PRIMARY KEY (id, num)
-- );

INSERT INTO zones(num, name) VALUES
  -- Esplanade-Gauche --
  (1, 'Esplanade-Gauche'),
  (2, 'Esplanade-Gauche'),
  (3, 'Esplanade-Gauche'),
  -- Esplanade-Centre --
  (1, 'Esplanade-Centre'),
  (2, 'Esplanade-Centre'),
  (3, 'Esplanade-Centre'),
  (4, 'Esplanade-Centre'),
  (5, 'Esplanade-Centre'),
  -- Esplanade-Droite --
  (1, 'Esplanade-Droite'),
  (2, 'Esplanade-Droite'),
  (3, 'Esplanade-Droite'),
  (4, 'Esplanade-Droite'),
  -- Esplanade-Accueil --
  (0, 'Esplanade-Accueil'),
  -- Antigone-Buvette --
  (0, 'Antigone-Buvette'),
  -- Antigone-Entree --
  (1, 'Antigone-Entree'),
  (2, 'Antigone-Entree'),
  (3, 'Antigone-Entree'),
  (4, 'Antigone-Entree'),
  (5, 'Antigone-Entree'),
  -- Antigone-Fond --
  (1, 'Antigone-Fond'),
  (2, 'Antigone-Fond'),
  -- Antigone-Proto --
  (0, 'Antigone-Proto'),
  -- Antigone-Loup-Garous --
  (0, 'Antigone-Loup-Garous');