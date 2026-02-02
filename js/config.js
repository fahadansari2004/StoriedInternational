/**
 * Supabase Configuration
 * Replace these values with your actual Supabase Project URL and Anon Key
 */
const SUPABASE_CONFIG = {
    URL: 'https://bdkkonflbagulfiexkkk.supabase.co',
    ANON_KEY: 'sb_publishable_Q993aN30rhit-cHlBw_PuA_GVaTGMPe'
};

// Initialize Supabase Client
const supabaseClient = typeof window !== 'undefined' && window.supabase ? window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY) : null;
