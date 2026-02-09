/**
 * Session Management Utility
 * Generates and manages session IDs for anonymous voting
 */

export function generateSessionId(): string {
    // Generate a unique session ID based on browser fingerprint
    // In production, you might want to use a more sophisticated fingerprinting library
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomPart}`;
}

export function getOrCreateSessionId(): string {
    if (typeof window === 'undefined') {
        return ''; // Server-side, return empty
    }

    const SESSION_KEY = 'rbu_session_id';
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
}

export function getBrowserFingerprint(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    // Simple fingerprint based on browser properties
    // In production, consider using a library like FingerprintJS
    const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    return btoa(JSON.stringify(fingerprint));
}
