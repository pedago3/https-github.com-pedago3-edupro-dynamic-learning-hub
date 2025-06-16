
-- Allow teachers to manage (CRUD) student "profiles"
-- We'll assume a student is any profile where "role" = 'student'
-- Each teacher can manage every student ("admin" teacher model); let us know if you want per-teacher granularity

-- 1. Enable RLS on "profiles" table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow authenticated users to select their own profile (preserves current behavior for students etc.)
CREATE POLICY "Profiles: student can read their own" 
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 3. Allow authenticated users to update their own profile
CREATE POLICY "Profiles: student can update their own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 4. Allow teachers to manage all students:
-- We'll use a SECURITY DEFINER function to check if the user is a teacher

-- 4.1 Create function to check if current user is a teacher
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 4.2 Allow teachers to insert "student" accounts
CREATE POLICY "Profiles: teacher can create students" 
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_teacher() AND role = 'student');

-- 4.3 Allow teachers to update student accounts
CREATE POLICY "Profiles: teacher can update students"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_teacher() AND role = 'student');

-- 4.4 Allow teachers to delete student accounts
CREATE POLICY "Profiles: teacher can delete students"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_teacher() AND role = 'student');

-- (Optional): If you want to restrict teachers so they can only CRUD students they "own" (e.g., via a relationship table), let me know!
