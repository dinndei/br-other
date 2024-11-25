import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET); // פענוח ואימות הטוקן
    } catch (error) {
        throw new Error('Invalid or expired token ' + error);
    }
}
