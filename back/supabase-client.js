const supabaseUrl = 'https://grelnipffaizijgpzhli.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZWxuaXBmZmFpemlqZ3B6aGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDI0NjUsImV4cCI6MjA4OTE3ODQ2NX0.RthR5w5AFZctatnuHg_uj6Dl3vfuNf8ZsffvadQ-vz8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
const db = supabaseClient;
