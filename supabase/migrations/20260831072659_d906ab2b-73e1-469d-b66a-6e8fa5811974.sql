CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  catalogo text NOT NULL,
  titulo text NOT NULL,
  anio int,
  tecnica text DEFAULT '',
  soporte text DEFAULT '',
  formato text DEFAULT '',
  descripcion text DEFAULT '',
  imagen_url text NOT NULL,
  orden int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.artworks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artworks TO authenticated;
GRANT ALL ON public.artworks TO service_role;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view artworks" ON public.artworks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert artworks" ON public.artworks FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update artworks" ON public.artworks FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete artworks" ON public.artworks FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.artworks (slug, catalogo, titulo, anio, imagen_url, orden) VALUES
('obra-01','TA-01','Obra 01',2026,'/__l5e/assets-v1/574f3eaf-7944-439b-bdf5-c6b1c2b7ba17/obra-01.jpg',1),
('obra-02','TA-02','Obra 02',2026,'/__l5e/assets-v1/cbf27d36-7df4-40c4-a1b0-400ee5c45e4e/obra-02.jpg',2),
('obra-03','TA-03','Obra 03',2026,'/__l5e/assets-v1/8af5239a-e597-4a15-b4f2-d7c8e88bcf44/obra-03.jpg',3),
('obra-04','TA-04','Obra 04',2026,'/__l5e/assets-v1/6e43ebe5-e12a-44ce-ae67-f394272a1a30/obra-04.jpg',4),
('obra-05','TA-05','Obra 05',2026,'/__l5e/assets-v1/fc5418a4-60f6-476b-9813-f8f9cbeb7b5d/obra-05.jpg',5),
('obra-06','TA-06','Obra 06',2026,'/__l5e/assets-v1/eeac1cca-d383-4859-aaad-a4512e28074f/obra-06.jpg',6),
('obra-07','TA-07','Obra 07',2026,'/__l5e/assets-v1/51b1b23c-15d4-419b-9b45-2d2101155eb8/obra-07.jpg',7),
('obra-08','TA-08','Obra 08',2026,'/__l5e/assets-v1/85c1a467-28a8-49b1-856e-7f4d09f116cf/obra-08.jpg',8);