/**
 * RankedByUs - PayPal Server-Side Integration
 * Handles order verification and capture to prevent fraudulent submissions.
 */

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

/**
 * Generates an access token using Client ID and Secret
 */
async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error('MISSING_PAYPAL_CREDENTIALS');
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const data = await response.json();
    return data.access_token;
}

/**
 * Captures a PayPal order by its ID
 * This is the ultimate verification step - if this fails, the payment wasn't legitimate.
 */
export async function captureOrder(orderID: string) {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            // 'PayPal-Request-Id': orderID, // Optional: for idempotency
        },
    });

    const data = await response.json();

    if (response.status !== 201 && response.status !== 200) {
        console.error('PayPal Capture Error:', data);
        throw new Error(data.message || 'Failed to capture PayPal order');
    }

    // Return the capture details
    return {
        id: data.id,
        status: data.status, // Should be 'COMPLETED'
        amount: data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
        transactionId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    };
}
