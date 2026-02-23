import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

/**
 * Validates if the current request is from an authorized administrator.
 * Checks both the legacy session cookie and the Supabase RBAC role.
 */
export async function verifyAdmin() {
    // 1. Check legacy admin_session cookie
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (adminSession?.value === 'authenticated') {
        return true;
    }

    // 2. Check Supabase RBAC metadata
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) return false;

        // Admins must have role: 'admin' in app_metadata
        if (user.app_metadata?.role === 'admin') {
            return true;
        }
    } catch (e) {
        console.error('Admin verification error:', e);
    }

    return false;
}
