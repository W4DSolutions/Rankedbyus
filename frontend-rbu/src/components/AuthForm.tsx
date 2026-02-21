'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export function AuthForm({ next }: { next?: string }) {
    const supabase = getSupabaseClient();
    const { theme } = useTheme();
    const router = useRouter();
    const [origin, setOrigin] = useState('');
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        setOrigin(window.location.origin);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, 'Session:', !!session);
            if (event === 'SIGNED_IN' || session) {
                setIsSignedIn(true);
                router.refresh(); // Important for server components to pull the new cookie
                // Use setTimeout to ensure the cookie is fully set in the browser
                setTimeout(() => {
                    window.location.href = next || '/profile';
                }, 500);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, next]);

    if (!origin) return null;

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                    Identity Verification
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Secure channel for tactical operators.
                </p>
            </div>

            {isSignedIn ? (
                <div className="text-center py-8">
                    <p className="text-green-600 dark:text-green-400 font-bold mb-4">Authentication successful!</p>
                    <p className="text-slate-500 text-sm mb-6">Redirecting to your profile...</p>
                    <button
                        onClick={() => window.location.href = next || '/profile'}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl w-full"
                    >
                        Continue Now
                    </button>
                </div>
            ) : (

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#2563eb',
                                    brandAccent: '#1d4ed8',
                                    inputBackground: theme === 'dark' ? '#1e293b' : '#f8fafc',
                                    inputText: theme === 'dark' ? 'white' : '#0f172a',
                                    inputBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
                                },
                                radii: {
                                    borderRadiusButton: '12px',
                                    inputBorderRadius: '12px',
                                },
                            },
                        },
                        className: {
                            button: 'font-bold uppercase tracking-widest text-xs !py-4',
                            input: 'font-medium',
                            label: 'font-bold uppercase tracking-widest text-[10px] text-slate-500',
                        }
                    }}
                    theme={theme === 'dark' ? 'dark' : 'default'}
                    providers={['google']}
                    redirectTo={`${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`}
                    onlyThirdPartyProviders={false}
                    magicLink={true}
                />
            )}
        </div>
    );
}
