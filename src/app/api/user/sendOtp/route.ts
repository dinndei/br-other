// import emailjs from 'emailjs-com';
// import crypto from 'crypto';
// import OTP from '@/app/DB/models/OtpModel'


// export async function sendCode(email: string): Promise<{ success: boolean; message: string }> {
//   console.log("comming to send");
  
//   const serviceID = process.env.SERVICEID || 'service_482i0ge';
//   const templateID = process.env.TEMPLATEID || 'template_9lur4ic';
//   const userID = process.env.USERID || 'pLqAh4TOK9zUWdkeC';

//   console.log("serviceID", serviceID);
//   console.log("templateID", templateID);
//   console.log("userID", userID);


//   const otp = crypto.randomBytes(3).toString('hex');  // יצירת 6 ספרות אקראיות
//   console.log(otp);
//   const expiryTime = Date.now() + 10 * 60 * 1000;

//   const otpRecord = new OTP({
//     email,
//     otpCode: otp,
//     expiry: new Date(expiryTime),
//   });

//   await otpRecord.save();

//   const templateParams = {
//     to_email: email,
//     subject: 'Your OTP Code',
//     otp_code: otp,
//   };

//   console.log(templateParams);


//   try {
//     await emailjs.send(serviceID, templateID, templateParams, userID);
//     console.log('OTP sent successfully');
//     return { success: true, message: 'OTP נשלח בהצלחה' };
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     return { success: false, message: 'שגיאה בשליחת ה-OTP. אנא נסה שוב.' };
//   }
// };

import type { NextApiRequest, NextApiResponse } from 'next';
import emailjs from 'emailjs-com';
import crypto from 'crypto';
import OTP from '@/app/DB/models/OtpModel';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    console.log('comming to send OTP for email:', email);

    const serviceID = process.env.SERVICEID || 'service_482i0ge';
    const templateID = process.env.TEMPLATEID || 'template_9lur4ic';
    const userID = process.env.USERID || 'pLqAh4TOK9zUWdkeC';

    const otp = crypto.randomBytes(3).toString('hex'); // יצירת 6 ספרות אקראיות
    const expiryTime = Date.now() + 10 * 60 * 1000; // תוקף ה-OTP למשך 10 דקות

    // יצירת אובייקט OTP חדש
    const otpRecord = new OTP({
      email,
      otpCode: otp,
      expiry: new Date(expiryTime),
    });

    try {
      await otpRecord.save();

      const templateParams = {
        to_email: email,
        subject: 'Your OTP Code',
        otp_code: otp,
      };

      // שליחת האימייל דרך emailjs
      await emailjs.send(serviceID, templateID, templateParams, userID);
      console.log('OTP sent successfully');
      
      return res.status(200).json({ success: true, message: 'OTP נשלח בהצלחה' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ success: false, message: 'שגיאה בשליחת ה-OTP. אנא נסה שוב.' });
    }
  
}

