import { hashPassword } from '../src/passwordHash.js';

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/hash-admin-password.js "your-password"');
    process.exit(1);
}

console.log(hashPassword(password));
