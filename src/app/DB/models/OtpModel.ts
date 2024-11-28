import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otpCode: { type: String, required: true },
  expiry: { type: Date, required: true }, 
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

export default OTP