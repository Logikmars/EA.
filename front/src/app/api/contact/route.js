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

        const { name, email, phone, link, message } = parsed.data;
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone || '-');
        const safeLink = escapeHtml(link || '-');
        const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
        const transporter = createTransporter();
        const to = process.env.CONTACT_FORM_TO;
        const from = process.env.CONTACT_FORM_FROM ?? process.env.SMTP_USER;

        if (!to || !from) {
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
                '',
                'Message:',
                message,
            ].join('\n'),
            html: `
                <h2>New contact request</h2>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Phone:</strong> ${safePhone}</p>
                <p><strong>Link:</strong> ${safeLink}</p>
                <p><strong>Message:</strong></p>
                <p>${safeMessage}</p>
            `,
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
