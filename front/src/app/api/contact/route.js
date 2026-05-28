import nodemailer from 'nodemailer';
import { contactFormSchema, formatContactFieldErrors } from '@/lib/contactFormSchema';

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

        return Response.json({ ok: true });
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
