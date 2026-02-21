'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-9 w-16 invisible" />; // Placeholder to prevent layout shift
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative flex h-9 w-16 items-center rounded-full bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/50 shadow-inner group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
            aria-label="Toggle Theme"
        >
            <div className={cn(
                "h-7 w-7 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                theme === 'dark'
                    ? "translate-x-7 bg-blue-600 border border-blue-400/50"
                    : "translate-x-0 bg-yellow-500 border border-yellow-300/50"
            )}>
                {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-white" />
                ) : (
                    <Sun className="h-4 w-4 text-white" />
                )}
            </div>
        </button>
    );
}
