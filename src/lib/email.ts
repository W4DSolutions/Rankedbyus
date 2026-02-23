import { Resend } from 'resend';

/**
 * RankedByUs - Official Email Service
 * Uses Resend to dispatch transactional emails to founders.
 */

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const IS_DEV = !process.env.RESEND_API_KEY;

interface EmailOptions {
  to: string;
  subject: string;
  template: 'item_approved' | 'item_rejected' | 'claim_approved' | 'claim_rejected';
  data: Record<string, any>;
}

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  const htmlContent = generateHtmlTemplate(template, data);

  if (IS_DEV) {
    console.log(`
    ========================================================
    [MOCK OUTBOUND EMAIL - No RESEND_API_KEY found]
    To: ${to}
    Subject: ${subject}
    Template: ${template}
    --------------------------------------------------------
    (HTML Payload rendered in memory. Length: ${htmlContent.length} bytes)
    ========================================================
    `);
    return { success: true, id: crypto.randomUUID() };
  }

  try {
    const { data: responseData, error } = await resend.emails.send({
      from: 'RankedByUs <hello@rankedbyus.com>',
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend encountered an error:', error);
      return { success: false, error };
    }

    return { success: true, id: responseData?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * Generates beautiful HTML emails using standard inline CSS.
 * This ensures the emails look perfectly branded across all email clients.
 */
function generateHtmlTemplate(template: EmailOptions['template'], data: Record<string, any>): string {
  const baseStyles = {
    body: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 40px 20px; line-height: 1.6;',
    container: 'max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100',
    header: 'background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 30px; text-align: center;',
    headerLogo: 'color: white; font-weight: 900; font-size: 28px; letter-spacing: -1px; margin: 0;',
    content: 'padding: 40px 30px;',
    h1: 'font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.5px;',
    p: 'font-size: 16px; color: #475569; margin-bottom: 24px;',
    button: 'display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 16px; margin-bottom: 20px;',
    footer: 'background-color: #f1f5f9; padding: 24px 30px; text-align: center; font-size: 14px; color: #64748b;',
    successBadge: 'display: inline-block; background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 99px; font-weight: 700; font-size: 13px; margin-bottom: 16px;',
    errorBadge: 'display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 99px; font-weight: 700; font-size: 13px; margin-bottom: 16px;',
  };

  const layout = (bodyHtml: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style="${baseStyles.body}">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="width: 100%;">
          <tr>
            <td>&nbsp;</td>
            <td style="${baseStyles.container}">
              <div style="${baseStyles.header}">
                <h1 style="${baseStyles.headerLogo}">RankedByUs</h1>
              </div>
              <div style="${baseStyles.content}">
                ${bodyHtml}
              </div>
              <div style="${baseStyles.footer}">
                <p style="margin: 0;">© ${new Date().getFullYear()} RankedByUs. All rights reserved.</p>
                <p style="margin-top: 8px;">If you didn't request this email, there's nothing to worry about — you can safely ignore it.</p>
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  `;

  switch (template) {
    case 'item_approved':
      return layout(`
        <span style="${baseStyles.successBadge}">✓ Tool Approved</span>
        <h1 style="${baseStyles.h1}">Your tool is now live on RankedByUs!</h1>
        <p style="${baseStyles.p}">Great news! <strong>${data.itemName || 'Your submission'}</strong> has successfully passed our moderation review and is now live on the platform.</p>
        <p style="${baseStyles.p}">Founders trust us to rank the absolute best tools on the internet. We are thrilled to have your product in the registry.</p>
        <a href="https://rankedbyus.com/tool/${data.itemSlug || ''}" style="${baseStyles.button}">View Your Listing</a>
        <p style="${baseStyles.p}">Tip: Share your direct link with your audience to start climbing the ranks instantly!</p>
      `);

    case 'item_rejected':
      return layout(`
        <span style="${baseStyles.errorBadge}">✕ Submission Rejected</span>
        <h1 style="${baseStyles.h1}">Update on your submission</h1>
        <p style="${baseStyles.p}">Thank you for submitting <strong>${data.itemName || 'your product'}</strong> to RankedByUs.</p>
        <p style="${baseStyles.p}">Unfortunately, our moderation team has decided not to list your tool at this time. This is typically because the product did not meet our quality guidelines, lacked necessary information, or didn't fit our current category structure.</p>
        <p style="${baseStyles.p}">We encourage you to try submitting again once the product has evolved, or if you believe this was a mistake, reply directly to this email.</p>
      `);

    case 'claim_approved':
      return layout(`
        <span style="${baseStyles.successBadge}">✓ Claim Verified</span>
        <h1 style="${baseStyles.h1}">You now own this listing!</h1>
        <p style="${baseStyles.p}">Your request to claim the listing for <strong>${data.itemName || 'this tool'}</strong> has been approved by our auditors.</p>
        <p style="${baseStyles.p}">You can now officially manage everything related to your product's Ranking journey on our platform.</p>
        <a href="https://rankedbyus.com/profile" style="${baseStyles.button}">Go to your Dashboard</a>
      `);

    case 'claim_rejected':
      return layout(`
        <span style="${baseStyles.errorBadge}">✕ Claim Denied</span>
        <h1 style="${baseStyles.h1}">Ownership claim unsuccessful</h1>
        <p style="${baseStyles.p}">We could not successfully verify your authority to claim the listing for <strong>${data.itemName || 'this tool'}</strong>.</p>
        <p style="${baseStyles.p}"><strong>Reason provided:</strong> ${data.reason || 'Not enough verifiable information provided.'}</p>
        <p style="${baseStyles.p}">If you believe this was an error, please submit a new claim with an official company email address or stronger proof of ownership.</p>
      `);

    default:
      return layout(`
        <h1 style="${baseStyles.h1}">Update from RankedByUs</h1>
        <p style="${baseStyles.p}">You have a new notification regarding your account or listings.</p>
      `);
  }
}
