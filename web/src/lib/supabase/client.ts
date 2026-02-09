
import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database.types'

// Use a singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
    if (supabaseInstance) return supabaseInstance

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey)
    return supabaseInstance
}
