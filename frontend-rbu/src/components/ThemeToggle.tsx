'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('rbu_theme') as 'dark' | 'light';
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            document.documentElement.classList.toggle('light', savedTheme === 'light');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('rbu_theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        document.documentElement.classList.toggle('light', newTheme === 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative flex h-9 w-16 items-center rounded-full bg-slate-800 p-1 border border-slate-700/50 shadow-inner group transition-colors hover:bg-slate-700"
            aria-label="Toggle Theme"
        >
            <div className={cn(
                "h-7 w-7 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                theme === 'dark'
                    ? "translate-x-7 bg-blue-600 border border-blue-400/50"
                    : "translate-x-0 bg-yellow-500 border border-yellow-300/50"
            )}>
                {theme === 'dark' ? (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.243l.707.707M7.757 6.343l.707.707" />
                    </svg>
                )}
            </div>
        </button>
    );
}
