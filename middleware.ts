import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// פונקציה לבדיקת טוקן
export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization"); // קבלת הטוקן מה-headers

  if (!token) {
    // אם הטוקן לא קיים, חסימת הגישה
    return NextResponse.redirect(new URL("/login", req.url)); // הפניה לדף התחברות
  }

  // בדיקת הטוקן אם הוא בפורמט המתאים
  if (!token.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Invalid token format" },
      { status: 401 }
    );
  }

  const actualToken = token.replace("Bearer ", ""); // הסרת המילה "Bearer " מהטוקן

  // כאן אפשר להוסיף אימות של הטוקן (לדוגמה, JWT validation)
  if (!isValidToken(actualToken)) {
    return NextResponse.json(
      { error: "Unauthorized - invalid token" },
      { status: 401 }
    );
  }

  // אם הכול תקין, ממשיכים לשלב הבא
  return NextResponse.next();
}

// פונקציה לבדיקה אם הטוקן תקין (לדוגמה, אימות JWT)
function isValidToken(token: string): boolean {
  try {
    // כאן אפשר להוסיף בדיקת JWT עם ספריות כמו `jsonwebtoken`
    return token === "valid_token_example"; // דוגמה בלבד, מחליפים באימות אמיתי
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

// הגדרת הנתיבים שבהם המידלוור יפעל
export const config = {
  matcher: ["/user/:path*", "/galery/:path*"], // הוסיפי כאן את הנתיבים המוגנים
};
