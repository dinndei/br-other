import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import toast from "react-hot-toast";
import { verifyToken } from "./app/lib/tokenConfig/verifyToken";

export function middleware(req: NextRequest) {
    console.log("Middleware active on path:", req.nextUrl.pathname);

    // נתיבים לא מוגנים
    const excludedPaths = ["/pages/user/login", "/pages/user/signup"];
    if (excludedPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next(); // לדלג על המידלוור
    }

    if (req.nextUrl.pathname === "/404") {
        return NextResponse.next();
    }
    // בדיקה אם הבקשה היא למשאב סטטי (כגון תמונה, קובץ JS או CSS)
    const isStaticResource = req.nextUrl.pathname.startsWith("/_next") ||
        req.nextUrl.pathname.startsWith("/static") ||
        /\.(.*)$/.test(req.nextUrl.pathname); // בדיקה אם יש סיומת קובץ
    if (isStaticResource) {
        return NextResponse.next(); // לדלג על המידלוור
    }

    const token = req.cookies.get("token");  // גישה לטוקן שנשמר ב-cookie
    
    if (!token) {
        return NextResponse.redirect(new URL("/pages/user/login", req.url));
    }

  
  
    if (!isValidToken(String(token))) {
        console.log("is valid=false");
        return NextResponse.json({ error: "Unauthorized - invalid token" }, { status: 401 });
    }

    return NextResponse.next();
}

function isValidToken(token: string): boolean {
    console.log("in isValidToken");

    // קריאה לפונקציה שבודקת את תקפות הטוקן, למשל עם JWT
    const decoded = verifyToken(token);
    
    if (!decoded) {
        return false;
    }
    return true;
}

export const config = {
    matcher: ["/pages/user/:path*"], // הפעלת המידלוור על כל הנתיבים
};
