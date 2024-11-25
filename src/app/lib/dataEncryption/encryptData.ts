import crypto from 'crypto';

const IV_LENGTH=process.env.IV_LENGTH!;
const ENCRYPTION_KEY=process.env.ENCRYPTION_KEY!;

// פונקציה להצפנת המידע
export function encryptData(data: string,): string {
    const iv = crypto.randomBytes(Number(IV_LENGTH)); // יצירת IV חדש
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // איחוד ה-IV עם המידע המוצפן
}