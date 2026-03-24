import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jqlkewhlbjlbgqbsxedq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbGtld2hsYmpsYmdxYnN4ZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDI4MzcsImV4cCI6MjA4OTkxODgzN30.eAczHsEb2tY-d9xQYSSn2wTwhiK57Hcj9C89cn2o8xo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
