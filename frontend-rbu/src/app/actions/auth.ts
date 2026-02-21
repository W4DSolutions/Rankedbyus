'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function claimProfileHistory() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('rbu_session_id')?.value

    if (!sessionId) {
        return { success: false, error: 'No anonymous session found' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Call the database function to migrate data
    const { data, error } = await supabase.rpc('claim_session_history', {
        p_session_id: sessionId,
        p_user_id: user.id
    })

    if (error) {
        console.error('Error claiming history:', error)
        return { success: false, error: error.message }
    }

    return { success: true, counts: data }
}
