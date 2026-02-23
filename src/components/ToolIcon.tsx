'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getLogoUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ToolIconProps {
    url?: string | null;
    name: string;
    websiteUrl?: string | null;
    className?: string;
    imgClassName?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
    sizes?: string;
}

export function ToolIcon({
    url,
    name,
    websiteUrl,
    className,
    imgClassName,
    width,
    height,
    fill = false,
    priority = false,
    unoptimized = true,
    sizes
}: ToolIconProps) {
    const [src, setSrc] = useState<string>(getLogoUrl(url, name, websiteUrl));
    const [errorCount, setErrorCount] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSrc(getLogoUrl(url, name, websiteUrl));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrorCount(0);
    }, [url, name, websiteUrl]);

    const handleError = () => {
        if (errorCount === 0) {
            // If the current src is already a google favicon and it failed, skip to final fallback
            const isGoogle = src.includes('google.com') || src.includes('gstatic.com');

            if (isGoogle) {
                setErrorCount(2);
                setSrc(getLogoUrl(null, name, null));
                return;
            }

            // Otherwise, try Google Favicon as step 2
            setErrorCount(1);
            if (websiteUrl) {
                try {
                    const urlObj = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
                    const domain = urlObj.hostname.replace('www.', '');
                    setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                } catch {
                    setErrorCount(2);
                    setSrc(getLogoUrl(null, name, null));
                }
            } else {
                setErrorCount(2);
                setSrc(getLogoUrl(null, name, null));
            }
        } else {
            // Final fallback to UI Avatars
            setErrorCount(2);
            setSrc(getLogoUrl(null, name, null));
        }
    };

    const isFill = fill || (!width && !height);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <Image
                src={src || getLogoUrl(null, name)} // Ensure we always have a src
                alt={name}
                width={!isFill ? width : undefined}
                height={!isFill ? height : undefined}
                fill={isFill}
                className={cn("object-contain", imgClassName)}
                onError={handleError}
                unoptimized={unoptimized}
                priority={priority}
                sizes={sizes}
            />
        </div>
    );
}
