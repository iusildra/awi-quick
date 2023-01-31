CREATE TABLE zone(
  zone_id INTEGER NOT NULL,
  zone_number INTEGER DEFAULT 0 NOT NULL,
  zone_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (zone_id, zone_number)
);

INSERT INTO zone VALUES
  -- Esplanade-Gauche --
  (1, 1, 'Esplanade-Gauche'),
  (1, 2, 'Esplanade-Gauche'),
  (1, 3, 'Esplanade-Gauche'),
  -- Esplanade-Centre --
  (2, 1, 'Esplanade-Centre'),
  (2, 2, 'Esplanade-Centre'),
  (2, 3, 'Esplanade-Centre'),
  (2, 4, 'Esplanade-Centre'),
  (2, 5, 'Esplanade-Centre'),
  -- Esplanade-Droite --
  (3, 1, 'Esplanade-Droite'),
  (3, 2, 'Esplanade-Droite'),
  (3, 3, 'Esplanade-Droite'),
  (3, 4, 'Esplanade-Droite'),
  -- Esplanade-Accueil --
  (4, 0, 'Esplanade-Accueil'),
  -- Antigone-Buvette --
  (5, 0, 'Antigone-Buvette'),
  -- Antigone-Entree --
  (6, 1, 'Antigone-Entree'),
  (6, 2, 'Antigone-Entree'),
  (6, 3, 'Antigone-Entree'),
  (6, 4, 'Antigone-Entree'),
  (6, 5, 'Antigone-Entree'),
  -- Antigone-Fond --
  (7, 1, 'Antigone-Fond'),
  (7, 2, 'Antigone-Fond'),
  -- Antigone-Proto --
  (8, 0, 'Antigone-Proto'),
  -- Antigone-Loup-Garous --
  (9, 0, 'Antigone-Loup-Garous');