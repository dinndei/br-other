import crypto from 'crypto';

const IV_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;


if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
    throw new Error("Invalid ENCRYPTION_KEY: Key must be 32 bytes (64 Hex characters) for AES-256-CBC.");
}

// פונקציה להצפנת המידע
export function encryptData(data: string,): string {
    const iv = crypto.randomBytes(IV_LENGTH);

    console.log("key", ENCRYPTION_KEY);
    console.log("IV details:", {
        ivLength: iv.length,
        ivBuffer: iv,
        ivType: typeof iv
    });
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // איחוד ה-IV עם המידע המוצפן
}