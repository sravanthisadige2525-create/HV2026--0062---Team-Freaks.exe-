import { createClient } from '@supabase/supabase-js';
const url = 'https://yvyuhaqznjvyvrypumal.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eXVoYXF6bmp2eXZyeXB1bWFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzAzODczMSwiZXhwIjoyMTAyNjE0NzMxfQ.JEOXewHs78QkhXDcT5s-pXNFvbaOVJM40nO8OWgrfqw';
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
const tables = ['profiles','certificates','assessment_submissions','skill_profiles','internships','courses','user_course_progress','app_notifications'];
for (const table of tables) {
  const { data, error } = await supabase.from(table).select('id').limit(1);
  if (error) {
    console.log(table + ': MISSING_OR_ERROR -> ' + (error.message || error.code || 'unknown'));
  } else {
    console.log(table + ': OK -> rows=' + (Array.isArray(data) ? data.length : 0));
  }
}
