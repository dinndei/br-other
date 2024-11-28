'use client'

import React, { useState } from "react";
import { useRouter } from "next/router";

const VerifyOtpForm = () => {
    const router = useRouter();
    const { sendedOtp } = router.query;
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (sendedOtp == otp) {
                alert('Verification successful!');
                router.push('/');  // ניווט לדף ברוך הבא
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
            <label htmlFor="otp" className="block font-medium">Enter OTP code</label>
            <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded w-full">Verify OTP</button>
        </form>
    );
};

export default VerifyOtpForm;
