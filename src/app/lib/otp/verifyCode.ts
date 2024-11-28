import axios from "axios";

export async function verifyOTP(email: string, otpInput: string) {

  try {
    // שליחה ל-API (קרא לפונקציה verifyOTP)
    const response = await axios.post('/api/user/verifyCode', {
      email: email,
      otpInput: otpInput
    });

    if (response.data.success) {
      return { success: true, message: response.data.message }
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Error during OTP verification', error);
    return { success: false, message: 'שגיאה במהלך אימות הקוד. אנא נסה שנית.' };
  }
}