import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import { contactFormSchema, formatContactFieldErrors } from '@/lib/contactFormSchema';
import { consumeRateLimit, getRateLimitClientKey } from '@/lib/rateLimit';

const contactRateLimitCookieName = 'contact_rl_id';

const escapeHtml = (value) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

const parseEmailList = (value) =>
    (value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

const formatFromAddress = (email, name) => {
    if (!email) {
        return '';
    }

    const trimmedName = name?.trim();

    if (!trimmedName) {
        return email;
    }

    return `"${trimmedName.replaceAll('"', '\\"')}" <${email}>`;
};

const createInfoRow = (label, value, href = '') => `
    <tr>
        <td style="padding: 0 0 18px; vertical-align: top;">
            <div style="font-size: 11px; line-height: 1.4; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; margin-bottom: 6px;">
                ${label}
            </div>
            ${
                href
                    ? `<a href="${href}" style="font-size: 16px; line-height: 1.6; color: #0b0b0b; text-decoration: none;">${value}</a>`
                    : `<div style="font-size: 16px; line-height: 1.6; color: #0b0b0b;">${value}</div>`
            }
        </td>
    </tr>
`;

const createContactEmailHtml = ({ name, email, phone, link, company, inquiryType, message }) => {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || '-');
    const safeLink = escapeHtml(link || '-');
    const safeCompany = escapeHtml(company || '-');
    const safeInquiryType = escapeHtml(inquiryType || '-');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || '';
    const safeSiteUrl = siteUrl ? escapeHtml(siteUrl) : '';
    const emailHref = `mailto:${encodeURIComponent(email)}`;
    const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';
    const linkHref = link?.trim() ? escapeHtml(link.trim()) : '';

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>New contact request</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #eef3f8;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:
                    radial-gradient(circle at top left, rgba(10, 102, 255, 0.18), transparent 28%),
                    linear-gradient(180deg, #f6f8fb 0%, #eef3f8 100%);
                    margin: 0;
                    padding: 32px 16px;
                    font-family: Inter, Arial, sans-serif;
                ">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 680px;">
                                <tr>
                                    <td style="padding-bottom: 16px; text-align: center; font-size: 12px; line-height: 1.5; letter-spacing: 0.16em; text-transform: uppercase; color: #6b7280;">
                                        EA Website
                                    </td>
                                </tr>
                                <tr>
                                    <td style="
                                        background:
                                            radial-gradient(circle at 20% 20%, rgba(10, 102, 255, 0.22), transparent 26%),
                                            radial-gradient(circle at 85% 0%, rgba(255, 255, 255, 0.12), transparent 18%),
                                            linear-gradient(180deg, #111827 0%, #0b0b0b 100%);
                                        border-radius: 28px 28px 0 0;
                                        padding: 40px 36px 32px;
                                        color: #ffffff;
                                    ">
                                        <div style="font-size: 12px; line-height: 1.4; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255, 255, 255, 0.66); margin-bottom: 16px;">
                                            New Contact Request
                                        </div>
                                        <div style="font-size: 34px; line-height: 1.15; font-weight: 700; margin: 0 0 14px;">
                                            ${safeName}
                                        </div>
                                        <div style="font-size: 16px; line-height: 1.7; color: rgba(255, 255, 255, 0.72); max-width: 520px;">
                                            A new inquiry was submitted through the EA contact form. Review the details below and reply directly to continue the conversation.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="
                                        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 249, 252, 0.98) 100%);
                                        border: 1px solid rgba(11, 11, 11, 0.08);
                                        border-top: none;
                                        border-radius: 0 0 28px 28px;
                                        box-shadow: 0 20px 40px rgba(11, 11, 11, 0.08);
                                        padding: 32px 36px 36px;
                                    ">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding-bottom: 24px;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="width: 50%; padding-right: 12px;">
                                                                ${createInfoRow('Email', safeEmail, emailHref)}
                                                            </td>
                                                            <td style="width: 50%; padding-left: 12px;">
                                                                ${createInfoRow('Phone', safePhone, phoneHref)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 50%; padding-right: 12px;">
                                                                ${createInfoRow('Contact Link', safeLink, linkHref)}
                                                            </td>
                                                            <td style="width: 50%; padding-left: 12px;">
                                                                ${createInfoRow('Company', safeCompany)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 50%; padding-right: 12px;">
                                                                ${createInfoRow('Inquiry Type', safeInquiryType)}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="
                                                        border-radius: 24px;
                                                        background:
                                                            radial-gradient(circle at top right, rgba(10, 102, 255, 0.12), transparent 26%),
                                                            linear-gradient(180deg, #ffffff 0%, #f3f6fb 100%);
                                                        border: 1px solid rgba(10, 102, 255, 0.12);
                                                        padding: 24px;
                                                    ">
                                                        <div style="font-size: 11px; line-height: 1.4; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">
                                                            Message
                                                        </div>
                                                        <div style="font-size: 16px; line-height: 1.8; color: #0b0b0b;">
                                                            ${safeMessage}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 28px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="padding-right: 12px;">
                                                                <a
                                                                    href="${emailHref}"
                                                                    style="
                                                                        display: inline-block;
                                                                        padding: 14px 22px;
                                                                        border-radius: 999px;
                                                                        background-color: #0a66ff;
                                                                        color: #ffffff;
                                                                        font-size: 14px;
                                                                        font-weight: 600;
                                                                        text-decoration: none;
                                                                    "
                                                                >
                                                                    Reply by Email
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a
                                                                    href="${safeSiteUrl || '#'}"
                                                                    style="
                                                                        display: inline-block;
                                                                        padding: 14px 22px;
                                                                        border-radius: 999px;
                                                                        border: 1px solid rgba(11, 11, 11, 0.12);
                                                                        color: #0b0b0b;
                                                                        font-size: 14px;
                                                                        font-weight: 600;
                                                                        text-decoration: none;
                                                                        background-color: rgba(255, 255, 255, 0.86);
                                                                    "
                                                                >
                                                                    Open Website
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 18px; text-align: center; font-size: 12px; line-height: 1.6; color: #6b7280;">
                                        Sent automatically from the EA contact form.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
};

const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error('Missing SMTP configuration');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user,
            pass,
        },
    });
};

export async function POST(request) {
    try {
        const existingCookieKey = request.cookies.get(contactRateLimitCookieName)?.value?.trim();
        const contactRateLimitCookieValue = existingCookieKey || randomUUID();
        const fallbackKey = `cookie:${contactRateLimitCookieValue}`;
        const rateLimit = consumeRateLimit({
            request,
            limit: 5,
            windowMs: 10 * 60 * 1000,
            keyPrefix: 'contact-form',
            fallbackKey,
        });
        const resolvedClientKey = getRateLimitClientKey(request, fallbackKey);

        if (!rateLimit.allowed) {
            const response = Response.json(
                {
                    ok: false,
                    message: 'Too many messages sent. Please try again later.',
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(rateLimit.retryAfter),
                    },
                }
            );

            if (resolvedClientKey === fallbackKey) {
                response.cookies.set(contactRateLimitCookieName, contactRateLimitCookieValue, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/',
                });
            }

            return response;
        }

        const body = await request.json();
        const parsed = contactFormSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json(
                {
                    ok: false,
                    message: 'Validation failed',
                    fieldErrors: formatContactFieldErrors(parsed.error),
                },
                { status: 400 }
            );
        }

        const { name, email, phone, link, company, inquiryType, message, website } = parsed.data;

        if (website) {
            return Response.json({ ok: true });
        }

        const transporter = createTransporter();
        const to = parseEmailList(process.env.CONTACT_FORM_TO);
        const from = formatFromAddress(
            process.env.CONTACT_FORM_FROM ?? process.env.SMTP_USER,
            process.env.CONTACT_FORM_FROM_NAME
        );

        if (to.length === 0 || !from) {
            throw new Error('Missing contact recipient configuration');
        }

        await transporter.sendMail({
            to,
            from,
            replyTo: email,
            subject: `New contact request from ${name}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone || '-'}`,
                `Link: ${link || '-'}`,
                `Company: ${company || '-'}`,
                `Inquiry Type: ${inquiryType}`,
                '',
                'Message:',
                message,
            ].join('\n'),
            html: createContactEmailHtml({ name, email, phone, link, company, inquiryType, message }),
        });

        const response = Response.json({ ok: true });

        if (resolvedClientKey === fallbackKey) {
            response.cookies.set(contactRateLimitCookieName, contactRateLimitCookieValue, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
            });
        }

        return response;
    } catch (error) {
        console.error('Contact form submission failed', error);

        return Response.json(
            {
                ok: false,
                message: 'Unable to send message right now',
            },
            { status: 500 }
        );
    }
}
