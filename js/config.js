/**
 * Supabase Configuration
 * Replace these values with your actual Supabase Project URL and Anon Key
 */
const SUPABASE_CONFIG = {
    URL: 'https://your-project-url.supabase.co',
    ANON_KEY: 'your-anon-key-here'
};

// Initialize Supabase Client
const supabase = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY) : null;
