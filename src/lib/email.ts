
/**
 * Mock Email Service for RankedByUs
 * In production, replace with Resend or SendGrid integration.
 */

interface EmailOptions {
  to: string;
  subject: string;
  template: 'item_approved' | 'item_rejected' | 'claim_approved' | 'claim_rejected';
  data: Record<string, unknown>;
}

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  // Integration point: In production, use 'resend' or similar
  // const resend = new Resend(process.env.RESEND_API_KEY);

  console.log(`
      --------------------------------------------------
      [OUTBOUND EMAIL]
      To: ${to}
      Subject: ${subject}
      Template: ${template}
      Data: ${JSON.stringify(data, null, 2)}
      --------------------------------------------------
    `);

  return { success: true, id: crypto.randomUUID() };
}
