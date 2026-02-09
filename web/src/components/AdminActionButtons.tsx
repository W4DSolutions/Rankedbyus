'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminActionButtonsProps {
    id: string;
}

export function AdminActionButtons({ id }: AdminActionButtonsProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this tool?`)) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/admin/tool-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, action }),
            });

            if (response.ok) {
                router.refresh(); // Refresh the Server Component data
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || 'Failed to process action'}`);
            }
        } catch (error) {
            console.error('Action error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex gap-2 ml-6">
            <button
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
            >
                {isProcessing ? '...' : 'Approve'}
            </button>
            <button
                className="rounded-lg border border-red-600 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/20 transition-colors disabled:opacity-50"
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
            >
                {isProcessing ? '...' : 'Reject'}
            </button>
        </div>
    );
}
