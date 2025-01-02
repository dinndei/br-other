import bcrypt from 'bcrypt';

// יצירת Hash לסיסמא
export async function hashPassword(password: string): Promise<string> {
    console.log("password in hash", password);

    const saltRounds = 10; // מספר הסבבים ליצירת ה-Salt

    return bcrypt.hash(password, saltRounds);
}