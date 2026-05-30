import { generateSecret, generateURI } from 'otplib';

const appName = process.env.ADMIN_2FA_APP_NAME || 'ArtNation Admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const secret = generateSecret();
const otpauth = generateURI({
    secret,
    issuer: appName,
    label: adminEmail,
});

console.log(`ADMIN_2FA_SECRET=${secret}`);
console.log('');
console.log('Add this secret to your .env file, then scan this otpauth URL in Google Authenticator:');
console.log(otpauth);
