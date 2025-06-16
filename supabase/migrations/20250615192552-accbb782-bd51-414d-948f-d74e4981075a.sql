
-- 1. Autoriser chaque enseignant à INSERER ses propres notifications
CREATE POLICY "Teacher insert own notifications"
  ON public.teacher_notifications
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- 2. Autoriser chaque enseignant à mettre à jour seulement ses notifications
CREATE POLICY "Teacher update own notifications"
  ON public.teacher_notifications
  FOR UPDATE
  USING (auth.uid() = teacher_id);

-- 3. Autoriser chaque enseignant à supprimer seulement ses notifications
CREATE POLICY "Teacher delete own notifications"
  ON public.teacher_notifications
  FOR DELETE
  USING (auth.uid() = teacher_id);
