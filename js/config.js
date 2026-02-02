/**
 * Supabase Configuration
 * Replace these values with your actual Supabase Project URL and Anon Key
 */
const SUPABASE_CONFIG = {
    URL: 'https://bdkkonflbagulfiexkkk.supabase.co',
    ANON_KEY: 'sb_secret_OrHMxyVS2mRQ0rjOxFvTew_qN5C2-Z4'
};

// Initialize Supabase Client
const supabaseClient = typeof window !== 'undefined' && window.supabase ? window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY) : null;
