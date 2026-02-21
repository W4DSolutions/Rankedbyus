'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

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
            className="group flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            Exit
        </button>
    );
}
