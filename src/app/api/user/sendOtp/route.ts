// import type { NextApiRequest, NextApiResponse } from 'next';
// import emailjs from 'emailjs-com';
// import crypto from 'crypto';
// import OTP from '@/app/DB/models/OtpModel';

// export  async function POST(req: NextApiRequest, res: NextApiResponse) {

//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ success: false, message: 'Email is required.' });
//     }

//     console.log('comming to send OTP for email:', email);

//     const serviceID = process.env.SERVICEID || 'service_482i0ge';
//     const templateID = process.env.TEMPLATEID || 'template_9lur4ic';
//     const userID = process.env.USERID || 'pLqAh4TOK9zUWdkeC';

//     const otp = crypto.randomBytes(3).toString('hex'); // יצירת 6 ספרות אקראיות
//     const expiryTime = Date.now() + 10 * 60 * 1000; // תוקף ה-OTP למשך 10 דקות

//     // יצירת אובייקט OTP חדש
//     const otpRecord = new OTP({
//       email,
//       otpCode: otp,
//       expiry: new Date(expiryTime),
//     });

//     try {
//       await otpRecord.save();

//       const templateParams = {
//         to_email: email,
//         subject: 'Your OTP Code',
//         otp_code: otp,
//       };

//       // שליחת האימייל דרך emailjs
//       await emailjs.send(serviceID, templateID, templateParams, userID);
//       console.log('OTP sent successfully');

//       return res.status(200).json({ success: true, message: 'OTP נשלח בהצלחה' });
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       return res.status(500).json({ success: false, message: 'שגיאה בשליחת ה-OTP. אנא נסה שוב.' });
//     }

// }

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import OTP from '@/app/DB/models/OtpModel';
import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/DB/connection/connectToDB';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    }

    console.log('Sending OTP for email:', email);

    // יצירת קוד OTP באורך 6 תו
    const otp = crypto.randomBytes(3).toString('hex');
    const expiryTime = Date.now() + 10 * 60 * 1000; // תוקף ה-OTP למשך 10 דקות

    const otpRecord = new OTP({
        email,
        otpCode: otp,
        expiry: new Date(expiryTime),
    });
    
    try {
        await connectToDB();

        await otpRecord.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'brother.otpcode@gmail.com', // כתובת הדוא"ל שלך
                pass: 'ghog ahvy isch skxg', // הסיסמה שלך או אפליקציה מאובטחת
            },
        });

        

        const mailOptions = {
            from: process.env.GMAIL_USER, 
            to: email, 
            subject: 'קוד חד פעמי',
            text: `הקוד החד פעמי שך למערכת הוא ${otp} תוקף הקוד הוא לעשר דקות`,
            html: `<p>הקוד החד פעמי שך למערכת הוא ${otp}</strong>. תוקף הקוד הוא לעשר דקות</p>`, 
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');

        return NextResponse.json({ success: true, message: 'OTP נשלח בהצלחה' }, { status: 200 });
    } catch (error) {
        console.error('Error sending OTP:', error);

        return NextResponse.json({ success: false, message: 'שגיאה בשליחת ה-OTP. אנא נסה שוב.' }, { status: 500 });
    }
}
