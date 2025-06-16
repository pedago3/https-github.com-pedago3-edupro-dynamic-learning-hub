
-- 1. Table de notifications enseignants
CREATE TABLE public.teacher_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  student_id UUID NOT NULL,
  course_id UUID,
  type_validation TEXT NOT NULL CHECK (type_validation IN ('cours', 'leçon', 'évaluation', 'quiz', 'devoir')),
  date_validation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payload JSONB NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS : chaque enseignant ne lit que ses notifications
ALTER TABLE public.teacher_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teacher read own notifications"
  ON public.teacher_notifications
  FOR SELECT
  USING (auth.uid() = teacher_id);

-- 3. Trigger sur lesson_progress : notification si completed=true (leçon validée)
CREATE OR REPLACE FUNCTION notify_teacher_on_lesson_completion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  teacher_id UUID;
  course_id UUID;
  student_name TEXT;
  course_name TEXT;
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT c.teacher_id, c.title INTO teacher_id, course_name
    FROM public.lessons l
    JOIN public.courses c ON l.course_id=c.id
    WHERE l.id=NEW.lesson_id;

    SELECT full_name INTO student_name FROM public.profiles WHERE id=NEW.student_id;

    IF teacher_id IS NOT NULL THEN
      INSERT INTO public.teacher_notifications (
        teacher_id, student_id, course_id, type_validation, date_validation, payload
      ) VALUES (
        teacher_id, NEW.student_id, (SELECT l.course_id FROM public.lessons l WHERE l.id=NEW.lesson_id), 'leçon', now(),
        jsonb_build_object(
          'élève', student_name,
          'cours', course_name,
          'type_validation', 'leçon',
          'date_validation', now()
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_notify_teacher_on_lesson_completion ON public.lesson_progress;
CREATE TRIGGER tr_notify_teacher_on_lesson_completion
AFTER INSERT OR UPDATE ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION notify_teacher_on_lesson_completion();

-- 4. Trigger sur course_enrollments : notification si progress >= 100 (cours validé)
CREATE OR REPLACE FUNCTION notify_teacher_on_course_completed()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  teacher_id UUID;
  course_name TEXT;
  student_name TEXT;
BEGIN
  IF NEW.progress >= 100 AND (OLD.progress IS NULL OR OLD.progress < 100) THEN
    SELECT teacher_id, title INTO teacher_id, course_name
    FROM public.courses WHERE id=NEW.course_id;

    SELECT full_name INTO student_name FROM public.profiles WHERE id=NEW.student_id;

    IF teacher_id IS NOT NULL THEN
      INSERT INTO public.teacher_notifications (
        teacher_id, student_id, course_id, type_validation, date_validation, payload
      ) VALUES (
        teacher_id, NEW.student_id, NEW.course_id, 'cours', now(),
        jsonb_build_object(
          'élève', student_name,
          'cours', course_name,
          'type_validation', 'cours',
          'date_validation', now()
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_notify_teacher_on_course_completed ON public.course_enrollments;
CREATE TRIGGER tr_notify_teacher_on_course_completed
AFTER INSERT OR UPDATE ON public.course_enrollments
FOR EACH ROW EXECUTE FUNCTION notify_teacher_on_course_completed();

-- 5. Trigger sur assessment_submissions : notification à la soumission
CREATE OR REPLACE FUNCTION notify_teacher_on_assessment_submission()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  teacher_id UUID;
  course_name TEXT;
  student_name TEXT;
  type_txt TEXT;
BEGIN
  -- Récupérer l’enseignant du cours et le nom du cours
  SELECT c.teacher_id, c.title INTO teacher_id, course_name
    FROM public.courses c WHERE c.id=NEW.course_id;

  SELECT full_name INTO student_name FROM public.profiles WHERE id=NEW.student_id;

  -- Différentier selon le type d’évaluation si besoin
  IF NEW.type IS NOT NULL THEN
    type_txt := NEW.type;
  ELSE
    type_txt := 'évaluation';
  END IF;

  IF teacher_id IS NOT NULL THEN
    INSERT INTO public.teacher_notifications (
      teacher_id, student_id, course_id, type_validation, date_validation, payload
    ) VALUES (
      teacher_id, NEW.student_id, NEW.course_id, type_txt, now(),
      jsonb_build_object(
        'élève', student_name,
        'cours', course_name,
        'type_validation', type_txt,
        'date_validation', now()
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_notify_teacher_on_assessment_submission ON public.assessment_submissions;
CREATE TRIGGER tr_notify_teacher_on_assessment_submission
AFTER INSERT ON public.assessment_submissions
FOR EACH ROW EXECUTE FUNCTION notify_teacher_on_assessment_submission();

