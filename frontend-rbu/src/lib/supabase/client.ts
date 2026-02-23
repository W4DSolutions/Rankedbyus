
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../../../types/database.types'

export const getSupabaseClient = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createBrowserClient<any>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export function createClient() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createBrowserClient<any>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
