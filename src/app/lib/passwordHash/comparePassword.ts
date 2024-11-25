import bcrypt from 'bcrypt';

// השוואת סיסמא עם Hash שמור
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}