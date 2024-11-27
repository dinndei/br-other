import emailjs from 'emailjs-com';
import crypto from 'crypto';


export async function sendCode(email: string) {
  const serviceID = process.env.SERVICEID || '';
  const templateID = process.env.TEMPLATEID || '';
  const userID = process.env.USERID || '';

  const otp = crypto.randomBytes(3).toString('hex');  // יצירת 6 ספרות אקראיות
  console.log(otp);


  const templateParams = {
    to_email: email,
    subject: 'Your OTP Code',
    otp_code: otp,
  };

  console.log(templateParams);


  try {
    await emailjs.send(serviceID, templateID, templateParams, userID);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
  return otp;
};


