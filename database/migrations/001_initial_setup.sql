-- ============================================================
-- The Godfather — Archivo Corleone
-- Migración inicial para Supabase (PostgreSQL)
-- Evidencia 21 · SENA
--
-- Ejecutar en el SQL Editor de Supabase o con la CLI:
--   supabase db push
--
-- La aplicación usa únicamente la clave anónima publicable.
-- Nunca se debe exponer la clave service_role en el cliente.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tabla de opiniones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movie_reviews (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_name        VARCHAR(60)  NOT NULL CHECK (char_length(visitor_name) BETWEEN 2 AND 60),
    favorite_character  VARCHAR(100) NOT NULL CHECK (char_length(favorite_character) > 0),
    rating              INTEGER      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment             VARCHAR(140) NOT NULL CHECK (char_length(comment) BETWEEN 3 AND 140),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE movie_reviews IS 'Opiniones anónimas de visitantes sobre The Godfather (1972).';

-- Índices para las consultas de la aplicación
CREATE INDEX IF NOT EXISTS idx_movie_reviews_created_at ON movie_reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movie_reviews_rating ON movie_reviews (rating);
CREATE INDEX IF NOT EXISTS idx_movie_reviews_character ON movie_reviews (favorite_character);

-- ------------------------------------------------------------
-- 2. Seguridad a nivel de fila (RLS)
-- ------------------------------------------------------------
ALTER TABLE movie_reviews ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquiera puede ver las opiniones publicadas.
DROP POLICY IF EXISTS "Lectura pública de opiniones" ON movie_reviews;
CREATE POLICY "Lectura pública de opiniones"
    ON movie_reviews
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Inserción anónima: el formulario no requiere autenticación.
DROP POLICY IF EXISTS "Inserción anónima de opiniones" ON movie_reviews;
CREATE POLICY "Inserción anónima de opiniones"
    ON movie_reviews
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Sin políticas de UPDATE ni DELETE: las opiniones no se editan ni se
-- borran desde el cliente. Esas operaciones quedan bloqueadas por RLS.

-- ------------------------------------------------------------
-- 3. Actualización automática de updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_movie_reviews_updated_at ON movie_reviews;
CREATE TRIGGER update_movie_reviews_updated_at
    BEFORE UPDATE ON movie_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------
-- 4. Vista de estadísticas
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW review_stats AS
SELECT
    COUNT(*)                                AS total_reviews,
    ROUND(AVG(rating)::numeric, 2)          AS average_rating,
    MIN(rating)                             AS min_rating,
    MAX(rating)                             AS max_rating,
    COUNT(*) FILTER (WHERE rating = 5)      AS five_star_reviews,
    COUNT(*) FILTER (WHERE rating = 1)      AS one_star_reviews,
    DATE_TRUNC('day', created_at)           AS review_date
FROM movie_reviews
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY review_date DESC;

-- ------------------------------------------------------------
-- 5. Datos de ejemplo (solo desarrollo)
-- ------------------------------------------------------------
-- INSERT INTO movie_reviews (visitor_name, favorite_character, rating, comment) VALUES
--   ('Juan Pérez', 'Don Vito Corleone', 5, 'La película es simplemente perfecta.'),
--   ('María García', 'Michael Corleone', 4, 'Excelente historia y actuaciones.'),
--   ('Carlos Rodríguez', 'Sonny Corleone', 5, 'Una película obligatoria para cualquier fan del cine.');

-- ============================================================
-- Verificación posterior:
--   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'movie_reviews';
--   SELECT polname, polcmd FROM pg_policy WHERE polrelid = 'movie_reviews'::regclass;
-- ============================================================
