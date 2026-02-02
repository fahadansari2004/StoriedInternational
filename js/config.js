/**
 * Supabase Configuration
 * Replace these values with your actual Supabase Project URL and Anon Key
 */
const SUPABASE_CONFIG = {
    URL: 'https://bdkkonflbagulfiexkkk.supabase.co',
    ANON_KEY: 'sb_publishable_Q993aN30rhit-cHlBw_PuA_GVaTGMPe'
};

// Initialize Supabase Client
console.log('--- Supabase Initialization ---');
console.log('Project URL:', SUPABASE_CONFIG.URL);
const supabaseClient = typeof window !== 'undefined' && window.supabase ? window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY) : null;
console.log('Client Created:', !!supabaseClient);
console.log('-------------------------------');
