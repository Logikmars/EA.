import { z } from 'zod';

const optionalTrimmedString = z
    .string()
    .trim()
    .max(255, 'Must be 255 characters or fewer')
    .optional()
    .or(z.literal(''));

export const contactFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be 100 characters or fewer'),
    email: z
        .string()
        .trim()
        .email('Enter a valid email address')
        .max(255, 'Email must be 255 characters or fewer'),
    phone: optionalTrimmedString,
    link: optionalTrimmedString,
    message: z
        .string()
        .trim()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must be 2000 characters or fewer'),
});

export const formatContactFieldErrors = (error) => {
    const flattened = error.flatten().fieldErrors;

    return Object.fromEntries(
        Object.entries(flattened)
            .filter(([, messages]) => messages?.length)
            .map(([field, messages]) => [field, messages[0]])
    );
};
