
-- Vérifier et corriger les politiques RLS pour la table student_badges
-- D'abord, supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own badges" ON student_badges;
DROP POLICY IF EXISTS "Users can create their own badges" ON student_badges;
DROP POLICY IF EXISTS "Students can view their own badges" ON student_badges;
DROP POLICY IF EXISTS "Students can create their own badges" ON student_badges;

-- Créer de nouvelles politiques RLS pour permettre aux étudiants de gérer leurs badges
CREATE POLICY "Students can view their own badges" 
  ON student_badges 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own badges" 
  ON student_badges 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

-- Optionnel : permettre la mise à jour des badges (par exemple pour marquer comme favori)
CREATE POLICY "Students can update their own badges" 
  ON student_badges 
  FOR UPDATE 
  USING (auth.uid() = student_id);

-- Vérifier que RLS est activé sur la table
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
