
'use client';

import { useMemo } from 'react';


interface TrafficData {
    date: string;
    views: number;
    clicks: number;
}

interface TrafficChartProps {
    data: TrafficData[];
    className?: string;
}

export function TrafficChart({ data, className }: TrafficChartProps) {
    // Generate last 7 days if data is empty or sparse, handled by parent ideally
    // But here we just render what we get.

    const maxValue = useMemo(() => {
        return Math.max(
            ...data.map(d => Math.max(d.views, d.clicks, 1)),
            10 // Minimum scale
        );
    }, [data]);

    const points = useMemo(() => {
        if (data.length === 0) return { views: '', clicks: '' };

        const width = 100; // SVG viewBox width
        const height = 50; // SVG viewBox height
        const step = width / (data.length - 1 || 1);

        const viewsPoints = data.map((d, i) => {
            const x = i * step;
            const y = height - (d.views / maxValue) * height;
            return `${x},${y}`;
        }).join(' ');

        const clicksPoints = data.map((d, i) => {
            const x = i * step;
            const y = height - (d.clicks / maxValue) * height;
            return `${x},${y}`;
        }).join(' ');

        return { views: viewsPoints, clicks: clicksPoints };

    }, [data, maxValue]);


    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Article Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tool Clicks</span>
                    </div>
                </div>
            </div>

            <div className="relative aspect-[3/1] w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden">
                {/* SVG Chart */}
                <svg
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none"
                    className="h-full w-full overflow-visible"
                >
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={50 - y / 2} // Scale 0-50 height
                            x2="100"
                            y2={50 - y / 2}
                            stroke="currentColor"
                            strokeWidth="0.1"
                            className="text-slate-200 dark:text-slate-800"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}

                    {/* Area Fills (Optional) */}

                    {/* Lines */}
                    <polyline
                        points={points.views}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-purple-500"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                    <polyline
                        points={points.clicks}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-blue-500"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                    {data.map((d, i) => (
                        (i % Math.ceil(data.length / 5) === 0 || i === data.length - 1) ? (
                            <span key={d.date}>{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        ) : null
                    ))}
                </div>
            </div>
        </div>
    );
}
