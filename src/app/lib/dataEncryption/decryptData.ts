import crypto from 'crypto';

const ENCRYPTION_KEY=process.env.ENCRYPTION_KEY!;

// פונקציה לפענוח המידע
export function decryptData(encryptedData: string): string {
    const [iv, encryptedText] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}