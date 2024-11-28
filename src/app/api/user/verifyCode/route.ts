// /app/api/user/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OTP from '@/app/DB/models/OtpModel';

export async function POST(req: NextRequest) {
    try {
        const { email, otpInput } = await req.json();

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return NextResponse.json({ success: false, message: 'לא נמצא קוד עבור מייל זה.' }, { status: 400 });
        }

        if (Date.now() > otpRecord.expiry.getTime()) {
            return NextResponse.json({ success: false, message: 'הקוד פג תוקף.' }, { status: 400 });
        }

        if (otpRecord.otpCode !== otpInput) {
            return NextResponse.json({ success: false, message: 'הקוד שגוי.' }, { status: 400 });
        }

        // מחיקת הקוד מהמסד לאחר האימות
        await OTP.deleteOne({ email });

        return NextResponse.json({ success: true, message: 'הקוד אומת בהצלחה.' });

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
        return NextResponse.json({ success: false, message: 'שגיאה באימות הקוד.' }, { status: 500 });
    }
}
