import IUser from '@/app/types/IUser';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

//מייצרת ומחירה טוקן עפי id וrole
export function generateToken(user:Partial<IUser>): string {
    const payload = {user}; // מידע על המשתמש
    const options = { expiresIn: '12h' };
    return jwt.sign(payload, JWT_SECRET, options); // יצירת הטוקן
}
