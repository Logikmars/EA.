import { z } from 'zod';

const phonePattern = /^[+\d\s()\-]{7,25}$/;
const socialLinkPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

const optionalPhoneSchema = z
    .string()
    .trim()
    .max(25, 'Phone number must be 25 characters or fewer')
    .refine((value) => !value || phonePattern.test(value), 'Enter a valid phone number')
    .optional()
    .or(z.literal(''));

const optionalSocialLinkSchema = z
    .string()
    .trim()
    .max(255, 'Link must be 255 characters or fewer')
    .refine((value) => !value || socialLinkPattern.test(value), 'Enter a valid http or https link')
    .optional()
    .or(z.literal(''));

const inquiryTypes = ['speaking', 'consulting', 'partnership', 'other'];

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
    phone: optionalPhoneSchema,
    link: optionalSocialLinkSchema,
    company: z
        .string()
        .trim()
        .max(120, 'Company name must be 120 characters or fewer')
        .optional()
        .or(z.literal('')),
    inquiryType: z.enum(inquiryTypes, 'Choose a valid inquiry type'),
    message: z
        .string()
        .trim()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must be 2000 characters or fewer'),
    website: z
        .string()
        .trim()
        .max(0, 'Spam detected')
        .optional()
        .or(z.literal('')),
});

export function validateContactField(field, value) {
    const schema = contactFormSchema.shape[field];

    if (!schema) {
        return false;
    }

    return schema.safeParse(value).success;
}

export const formatContactFieldErrors = (error) => {
    const flattened = error.flatten().fieldErrors;

    return Object.fromEntries(
        Object.entries(flattened)
            .filter(([, messages]) => messages?.length)
            .map(([field, messages]) => [field, messages[0]])
    );
};
