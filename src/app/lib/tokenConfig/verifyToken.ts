
import JWTPayload from '@/app/types/JWTPayload';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string | null): JWTPayload|null {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_SECRET me:',JWT_SECRET);
    try {
        if (token)
            return jwt.verify(token, JWT_SECRET) as JWTPayload;// פענוח ואימות הטוקן
        return null;
    } catch (error) {
        throw new Error('Invalid or expired token ' + error);
    }
}
