// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lnmupodnovuybohzuhpu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXVwb2Rub3Z1eWJvaHp1aHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzk3MTksImV4cCI6MjA2NDA1NTcxOX0.oZQyx4uZEJnhWEdfIKQ65jCaYZgsfqPU88yRqu2s7qI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);