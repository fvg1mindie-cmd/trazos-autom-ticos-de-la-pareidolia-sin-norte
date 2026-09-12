ALTER TABLE public.artworks
ADD COLUMN imagenes text[] NOT NULL DEFAULT ARRAY[]::text[];