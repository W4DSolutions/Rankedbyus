
import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export const alt = 'RankedByUs Strategic Analysis';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { data: article } = await supabase
        .from('articles')
        .select(`
            title,
            author_name,
            created_at
        `)
        .eq('slug', params.slug)
        .single();

    const title = article?.title || 'Strategic Analysis';
    const author = article?.author_name || 'RankedByUs';
    const date = article?.created_at ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#ffffff',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    fontFamily: 'sans-serif',
                    color: '#0f172a',
                    padding: '80px',
                    position: 'relative',
                }}
            >
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                }} />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '40px',
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: '#0f172a',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: '24px',
                    }}>R</div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}>RankedByUs</div>
                </div>

                <div style={{
                    fontSize: '80px',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.03em',
                    maxWidth: '900px',
                    zIndex: 10,
                }}>
                    {title}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '60px',
                    marginTop: 'auto',
                    borderTop: '2px solid #f1f5f9',
                    paddingTop: '40px',
                    width: '100%',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '8px' }}>Auditor</div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{author}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '8px' }}>Published</div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{date}</div>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '12px 24px', background: '#eff6ff', borderRadius: '100px', color: '#2563eb', fontWeight: 700, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Deep Analysis
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
