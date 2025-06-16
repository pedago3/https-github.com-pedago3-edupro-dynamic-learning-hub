
-- Ajouter la colonne email à la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Mettre à jour la fonction handle_new_user pour insérer le champ email si présent dans les métadonnées
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE(NEW.raw_user_meta_data->>'email', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

-- Autoriser l'update du champ email pour les étudiants par leur enseignant
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles: teacher can create students" ON public.profiles;
CREATE POLICY "Profiles: teacher can create students" 
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_teacher() AND role = 'student');

DROP POLICY IF EXISTS "Profiles: teacher can update students" ON public.profiles;
CREATE POLICY "Profiles: teacher can update students"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_teacher() AND role = 'student');
