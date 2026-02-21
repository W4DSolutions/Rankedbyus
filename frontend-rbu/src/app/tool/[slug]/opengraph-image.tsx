
import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export const alt = 'RankedByUs Tool Analysis';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { data: tool } = await supabase
        .from('items')
        .select(`
            name,
            description,
            average_rating,
            score,
            is_verified,
            logo_url,
            categories (name)
        `)
        .eq('slug', params.slug)
        .single();

    const toolName = tool?.name || 'Unknown Tool';
    const categoryName = Array.isArray(tool?.categories) ? tool.categories[0]?.name : (tool?.categories as any)?.name || 'Software';
    const rating = tool?.average_rating ? tool.average_rating.toFixed(1) : 'N/A';
    const score = tool?.score ? tool.score.toLocaleString() : '0';

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    color: 'white',
                    position: 'relative',
                }}
            >
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    zIndex: 10,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '24px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: '#94a3b8',
                        marginBottom: '40px',
                    }}>
                        RankedByUs Analysis
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '96px',
                        fontWeight: 900,
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.05em',
                        textAlign: 'center',
                        maxWidth: '1000px',
                        gap: '30px',
                    }}>
                        {tool?.logo_url && (
                            <div style={{
                                width: '120px',
                                height: '120px',
                                background: 'white',
                                borderRadius: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                            }}>
                                <img src={tool.logo_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                            </div>
                        )}
                        <span style={{
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}>
                            {toolName}
                        </span>
                    </div>

                    {tool?.is_verified && (
                        <div style={{
                            marginTop: '20px',
                            background: '#3b82f6',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '100px',
                            fontSize: '20px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            ✓ Founder Verified
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px',
                        marginTop: '60px',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            padding: '24px 48px',
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '8px' }}>Community Rating</div>
                            <div style={{ fontSize: '64px', fontWeight: 900, color: '#fbbf24' }}>★ {rating}</div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '24px',
                            padding: '24px 48px',
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#60a5fa', marginBottom: '8px' }}>Alpha Score</div>
                            <div style={{ fontSize: '64px', fontWeight: 900, color: '#3b82f6' }}>{score}</div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '40px',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}>
                        {categoryName}
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
