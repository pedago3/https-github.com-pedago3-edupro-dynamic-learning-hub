
-- Créer une fonction pour attribuer automatiquement des badges lors de la completion d'une leçon
CREATE OR REPLACE FUNCTION public.auto_award_lesson_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si la leçon est maintenant complétée
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    -- Badge pour première leçon complétée
    INSERT INTO public.student_badges (student_id, badge_id)
    SELECT NEW.student_id, b.id
    FROM public.badges b
    WHERE b.criteria->>'first_lesson' = 'true'
    AND NOT EXISTS (
      SELECT 1 FROM public.student_badges sb 
      WHERE sb.student_id = NEW.student_id AND sb.badge_id = b.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.lesson_progress lp2
      WHERE lp2.student_id = NEW.student_id 
      AND lp2.completed = true 
      AND lp2.id != NEW.id
    );
    
    -- Badge pour 5 leçons complétées
    INSERT INTO public.student_badges (student_id, badge_id)
    SELECT NEW.student_id, b.id
    FROM public.badges b
    WHERE b.criteria->>'lessons_5' = 'true'
    AND NOT EXISTS (
      SELECT 1 FROM public.student_badges sb 
      WHERE sb.student_id = NEW.student_id AND sb.badge_id = b.id
    )
    AND (
      SELECT COUNT(*) FROM public.lesson_progress lp3
      WHERE lp3.student_id = NEW.student_id AND lp3.completed = true
    ) >= 5;
    
    -- Badge pour 10 leçons complétées
    INSERT INTO public.student_badges (student_id, badge_id)
    SELECT NEW.student_id, b.id
    FROM public.badges b
    WHERE b.criteria->>'lessons_10' = 'true'
    AND NOT EXISTS (
      SELECT 1 FROM public.student_badges sb 
      WHERE sb.student_id = NEW.student_id AND sb.badge_id = b.id
    )
    AND (
      SELECT COUNT(*) FROM public.lesson_progress lp4
      WHERE lp4.student_id = NEW.student_id AND lp4.completed = true
    ) >= 10;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer une fonction pour attribuer automatiquement des badges lors de la soumission d'un quiz
CREATE OR REPLACE FUNCTION public.auto_award_assessment_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Badge pour premier quiz complété
  INSERT INTO public.student_badges (student_id, badge_id)
  SELECT NEW.student_id, b.id
  FROM public.badges b
  WHERE b.criteria->>'first_assessment' = 'true'
  AND NOT EXISTS (
    SELECT 1 FROM public.student_badges sb 
    WHERE sb.student_id = NEW.student_id AND sb.badge_id = b.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.assessment_submissions as2
    WHERE as2.student_id = NEW.student_id AND as2.id != NEW.id
  );
  
  -- Badge pour score parfait (100%)
  IF NEW.score >= 100 THEN
    INSERT INTO public.student_badges (student_id, badge_id)
    SELECT NEW.student_id, b.id
    FROM public.badges b
    WHERE b.criteria->>'perfect_score' = 'true'
    AND NOT EXISTS (
      SELECT 1 FROM public.student_badges sb 
      WHERE sb.student_id = NEW.student_id AND sb.badge_id = b.id
    );
  END IF;
  
  -- Badge pour 5 quiz complétés
  INSERT INTO public.student_badges (student_id, badge_id)
  SELECT NEW.student_id, b.id
  FROM public.badges b
  WHERE b.criteria->>'assessments_5' = 'true'
  AND NOT EXISTS (
    SELECT 1 FROM public.student_badges sb 
    WHERE sb.student_id = NEW.student_id AND sb.badge_id = b.id
  )
  AND (
    SELECT COUNT(*) FROM public.assessment_submissions as3
    WHERE as3.student_id = NEW.student_id
  ) >= 5;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer les déclencheurs
DROP TRIGGER IF EXISTS trigger_auto_award_lesson_badges ON public.lesson_progress;
CREATE TRIGGER trigger_auto_award_lesson_badges
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_award_lesson_badges();

DROP TRIGGER IF EXISTS trigger_auto_award_assessment_badges ON public.assessment_submissions;
CREATE TRIGGER trigger_auto_award_assessment_badges
  AFTER INSERT OR UPDATE ON public.assessment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_award_assessment_badges();

-- Créer quelques badges par défaut (seulement si ils n'existent pas déjà)
DO $$
BEGIN
  -- Badge pour première leçon
  IF NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Première Leçon') THEN
    INSERT INTO public.badges (name, description, icon, criteria) 
    VALUES ('Première Leçon', 'Complétez votre première leçon', '🎯', '{"first_lesson": "true"}');
  END IF;
  
  -- Badge pour 5 leçons
  IF NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Étudiant Assidu') THEN
    INSERT INTO public.badges (name, description, icon, criteria) 
    VALUES ('Étudiant Assidu', 'Complétez 5 leçons', '📚', '{"lessons_5": "true"}');
  END IF;
  
  -- Badge pour 10 leçons
  IF NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Expert') THEN
    INSERT INTO public.badges (name, description, icon, criteria) 
    VALUES ('Expert', 'Complétez 10 leçons', '🏆', '{"lessons_10": "true"}');
  END IF;
  
  -- Badge pour premier quiz
  IF NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Premier Quiz') THEN
    INSERT INTO public.badges (name, description, icon, criteria) 
    VALUES ('Premier Quiz', 'Complétez votre premier quiz', '✅', '{"first_assessment": "true"}');
  END IF;
  
  -- Badge pour score parfait
  IF NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Score Parfait') THEN
    INSERT INTO public.badges (name, description, icon, criteria) 
    VALUES ('Score Parfait', 'Obtenez 100% à un quiz', '🌟', '{"perfect_score": "true"}');
  END IF;
  
  -- Badge pour 5 quiz
  IF NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Quiz Master') THEN
    INSERT INTO public.badges (name, description, icon, criteria) 
    VALUES ('Quiz Master', 'Complétez 5 quiz', '🧠', '{"assessments_5": "true"}');
  END IF;
END $$;
