import { createClient } from '@supabase/supabase-js'

// creates a Supabase client instance with project URL and key for database interactions 
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)