'use client';

import { useRouter } from 'next/navigation';

export function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/admin/logout', {
                method: 'POST',
            });

            if (response.ok) {
                router.push('/admin/login');
                router.refresh();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
        >
            Logout
        </button>
    );
}
