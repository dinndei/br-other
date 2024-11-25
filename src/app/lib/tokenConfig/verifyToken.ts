import { JWTPayload } from '@/app/types/jwtPayload';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string): JWTPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload; // פענוח ואימות הטוקן
    } catch (error) {
        throw new Error('Invalid or expired token ' + error);
    }
}
